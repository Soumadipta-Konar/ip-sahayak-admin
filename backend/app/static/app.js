/**
 * IP-SAKTI Sahayak - Admin Console Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let corpusDocuments = [];
  let currentActiveFile = null;

  // DOM Elements
  const corpusTableBody = document.getElementById('corpus-table-body');
  const searchInput = document.getElementById('search-input');
  const formatSelect = document.getElementById('format-select');
  const docCountBadge = document.getElementById('doc-count-badge');
  const statTotalDocs = document.getElementById('stat-total-docs');
  const statTotalChunks = document.getElementById('stat-total-chunks');
  const qdrantIndicator = document.getElementById('qdrant-indicator');
  const qdrantStatusText = document.getElementById('qdrant-status-text');
  const neo4jIndicator = document.getElementById('neo4j-indicator');
  const neo4jStatusText = document.getElementById('neo4j-status-text');
  const terminalBody = document.getElementById('terminal-body');

  // Buttons
  const btnRefresh = document.getElementById('btn-refresh');
  const btnBatchIngest = document.getElementById('btn-batch-ingest');
  const btnDryRun = document.getElementById('btn-dry-run');

  const btnClearLogs = document.getElementById('btn-clear-logs');
  const btnOpenUpload = document.getElementById('btn-open-upload');

  // Modals
  const inspectorModal = document.getElementById('inspector-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnModalIngest = document.getElementById('btn-modal-ingest');
  const modalDocTitle = document.getElementById('modal-doc-title');
  const modalDocSubtitle = document.getElementById('modal-doc-subtitle');
  const modalChunkCount = document.getElementById('modal-chunk-count');
  const chunksContainer = document.getElementById('chunks-container');
  const payloadJsonView = document.getElementById('payload-json-view');
  const graphTriplesList = document.getElementById('graph-triples-list');

  // Tabs
  const tabBtnChunks = document.getElementById('tab-btn-chunks');
  const tabBtnPayload = document.getElementById('tab-btn-payload');
  const tabBtnGraph = document.getElementById('tab-btn-graph');
  const tabContentChunks = document.getElementById('tab-content-chunks');
  const tabContentPayload = document.getElementById('tab-content-payload');
  const tabContentGraph = document.getElementById('tab-content-graph');

  // Upload Modal
  const uploadModal = document.getElementById('upload-modal');
  const btnCloseUpload = document.getElementById('btn-close-upload');
  const uploadForm = document.getElementById('upload-form');

  // --- Logger ---
  function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `log-line log-${type}`;
    line.textContent = `[${timestamp}] ${message}`;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // --- API Calls ---

  async function fetchHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      const data = await res.json();

      // Qdrant Status
      const qd = data.database_health?.qdrant || 'offline';
      if (qd.includes('connected')) {
        qdrantIndicator.className = 'dot dot-emerald';
        qdrantStatusText.textContent = 'Connected (Live)';
      } else {
        qdrantIndicator.className = 'dot dot-amber';
        qdrantStatusText.textContent = 'Offline (Docker)';
      }

      // Neo4j Status
      const n4 = data.database_health?.neo4j || 'offline';
      if (n4.includes('connected')) {
        neo4jIndicator.className = 'dot dot-emerald';
        neo4jStatusText.textContent = 'Connected (Live)';
      } else {
        neo4jIndicator.className = 'dot dot-amber';
        neo4jStatusText.textContent = 'Offline (Docker)';
      }
    } catch (err) {
      qdrantIndicator.className = 'dot dot-red';
      qdrantStatusText.textContent = 'Unreachable';
      neo4jIndicator.className = 'dot dot-red';
      neo4jStatusText.textContent = 'Unreachable';
    }
  }

  async function fetchCorpus() {
    try {
      const res = await fetch('/api/corpus/index');
      if (!res.ok) throw new Error('Failed to load corpus index');
      const data = await res.json();
      corpusDocuments = data.documents || [];
      renderCorpusTable(corpusDocuments);
      updateKPIs(corpusDocuments);
      addLog(`Loaded ${corpusDocuments.length} registered document(s) from corpus_index.csv.`, 'info');
    } catch (err) {
      addLog(`Error fetching corpus: ${err.message}`, 'error');
      corpusTableBody.innerHTML = `<tr><td colspan="7" class="loading-cell text-red">Failed to load corpus records.</td></tr>`;
    }
  }

  function updateKPIs(docs) {
    statTotalDocs.textContent = docs.length;
    docCountBadge.textContent = `${docs.length} files registered`;
    // Approx estimate if not live
    statTotalChunks.textContent = docs.length * 3;
  }

  function renderCorpusTable(docs) {
    if (!docs || docs.length === 0) {
      corpusTableBody.innerHTML = `<tr><td colspan="7" class="loading-cell">No documents found in corpus. Click "Upload Document" to add one.</td></tr>`;
      return;
    }

    corpusTableBody.innerHTML = docs.map(doc => {
      const fileName = doc.file_path.split('/').pop();
      const statusClass = doc.status === 'Ingested' ? 'status-ingested' :
                          doc.status === 'Failed' ? 'status-failed' : 'status-pending';
      const typeClass = `type-${doc.document_type || 'statute'}`;

      return `
        <tr data-file="${fileName}">
          <td class="cell-doc-name">${fileName}</td>
          <td><strong>${doc.act_name || doc.document_title}</strong></td>
          <td>${doc.year || '2024'}</td>
          <td><span class="pill-badge pill-neutral">${doc.jurisdiction || 'IN'}</span></td>
          <td><span class="type-badge ${typeClass}">${doc.document_type || 'statute'}</span></td>
          <td>
            <span class="status-badge ${statusClass}">
              <span class="dot ${doc.status === 'Ingested' ? 'dot-emerald' : 'dot-amber'}"></span>
              ${doc.status || 'Pending'}
            </span>
          </td>
          <td class="actions-cell">
            <button class="btn btn-outline btn-sm btn-inspect" data-file="${fileName}" data-act="${doc.act_name}">
              🔍 Chunks
            </button>
            <button class="btn btn-emerald btn-sm btn-ingest-single" data-file="${fileName}" data-act="${doc.act_name}">
              ⚡ Ingest
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row events
    document.querySelectorAll('.btn-inspect').forEach(btn => {
      btn.addEventListener('click', () => openInspector(btn.dataset.file, btn.dataset.act));
    });

    document.querySelectorAll('.btn-ingest-single').forEach(btn => {
      btn.addEventListener('click', () => ingestSingle(btn.dataset.file, btn.dataset.act));
    });
  }

  // --- Search Filter ---
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = corpusDocuments.filter(d =>
      d.file_path.toLowerCase().includes(q) ||
      (d.act_name && d.act_name.toLowerCase().includes(q)) ||
      (d.document_type && d.document_type.toLowerCase().includes(q))
    );
    renderCorpusTable(filtered);
  });

  // --- Inspector Modal & Chunk Preview ---
  async function openInspector(fileName, actName) {
    currentActiveFile = fileName;
    modalDocTitle.textContent = actName || fileName;
    modalDocSubtitle.textContent = `Inspecting file: ${fileName} &bull; Hierarchical regex chunks with injected breadcrumbs`;
    chunksContainer.innerHTML = '<p class="loading-cell">Parsing and chunking statute with breadcrumbs...</p>';
    inspectorModal.classList.remove('hidden');

    try {
      addLog(`Extracting and previewing chunks for ${fileName}...`, 'info');
      const res = await fetch('/api/preview/chunks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: fileName, format: formatSelect.value })
      });

      if (!res.ok) throw new Error('Chunk extraction failed');
      const data = await res.json();

      modalChunkCount.textContent = data.total_chunks;
      renderChunks(data.chunks);
      renderPayloadPreview(data.chunks[0]?.qdrant_payload_preview || {});
      renderGraphTriples(fileName, data.chunks);
      addLog(`Extracted ${data.total_chunks} chunk(s) for ${fileName}.`, 'success');
    } catch (err) {
      chunksContainer.innerHTML = `<p class="loading-cell text-red">Error: ${err.message}</p>`;
      addLog(`Chunk preview error for ${fileName}: ${err.message}`, 'error');
    }
  }

  function renderChunks(chunks) {
    if (!chunks || chunks.length === 0) {
      chunksContainer.innerHTML = '<p class="loading-cell">No chunks extracted.</p>';
      return;
    }

    chunksContainer.innerHTML = chunks.map(c => `
      <div class="chunk-card">
        <div class="chunk-header">
          <div>
            ${c.act_name ? `<span class="pill-badge pill-neutral" style="margin-right:6px; font-weight:600;">${c.act_name}</span>` : ''}
            <span class="chunk-badge">${c.chapter_name} &bull; ${c.section_name}</span>
          </div>
          <span class="chunk-chars">${c.character_count} chars</span>
        </div>
        <div class="chunk-breadcrumb">${c.breadcrumb || '[Breadcrumb Injected]'}</div>
        <div class="chunk-verbatim">${c.verbatim}</div>
      </div>
    `).join('');
  }

  function renderPayloadPreview(payload) {
    payloadJsonView.textContent = JSON.stringify(payload, null, 2);
  }

  function renderGraphTriples(fileName, chunks) {
    const isPatents = fileName.includes('patent');
    const isBda = fileName.includes('diversity') || fileName.includes('bda');

    let triples = [
      { s: 'Statute', sText: fileName.replace(/_/g, ' ').replace(/\.\w+$/, ''), rel: '[:HAS_CHAPTER]', o: 'Chapter', oText: 'Chapter I / II' },
      { s: 'Chapter', sText: 'Chapter II', rel: '[:CONTAINS_SECTION]', o: 'Section', oText: 'Section 3 / Section 6' }
    ];

    if (isPatents) {
      triples.push(
        { s: 'Section', sText: 'Section 3(p)', rel: '[:CROSS_REFERENCES_PRIOR_ART]', o: 'PriorArtDatabase', oText: 'CSIR_TKDL' },
        { s: 'Section', sText: 'Section 3(p)', rel: '[:ENFORCED_BY]', o: 'RegulatoryAuthority', oText: 'IPO (Indian Patent Office)' },
        { s: 'Section', sText: 'Section 3(p)', rel: '[:MANDATES_COMPLIANCE_WITH]', o: 'Section', oText: 'BDA Sec 6' }
      );
    }
    if (isBda || isPatents) {
      triples.push(
        { s: 'Section', sText: 'BDA Section 6', rel: '[:REQUIRES_STATUTORY_FORM]', o: 'StatutoryForm', oText: 'Form III' },
        { s: 'Section', sText: 'BDA Section 6', rel: '[:ENFORCED_BY]', o: 'RegulatoryAuthority', oText: 'NBA (National Biodiversity Authority)' }
      );
    }

    graphTriplesList.innerHTML = triples.map(t => `
      <div class="triple-item">
        <span class="node-chip node-statute">(:${t.s} {title: "${t.sText}"})</span>
        <span class="rel-arrow">&mdash;${t.rel}&rarr;</span>
        <span class="node-chip node-section">(:${t.o} {name: "${t.oText}"})</span>
      </div>
    `).join('');
  }

  // --- Ingestion Actions ---
  async function ingestSingle(fileName, actName) {
    addLog(`Initiating ingestion for ${fileName}...`, 'info');
    try {
      const res = await fetch('/api/ingest/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_path: fileName,
          act_name: actName,
          format: formatSelect.value,
          dry_run: false
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Ingestion failed');

      addLog(`Successfully ingested ${fileName}: ${data.data.chunks_count} chunks, ${data.data.vectors_inserted} vectors.`, 'success');
      fetchCorpus();
    } catch (err) {
      addLog(`Ingestion failed for ${fileName}: ${err.message}`, 'error');
    }
  }

  btnBatchIngest.addEventListener('click', async () => {
    addLog(`Starting batch ingestion for all documents in corpus_extracted/...`, 'info');
    try {
      const res = await fetch('/api/ingest/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dir_path: 'corpus_extracted',
          format: formatSelect.value,
          dry_run: false
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Batch ingestion failed');

      addLog(`Batch ingestion finished: ${data.message}`, 'success');
      fetchCorpus();
    } catch (err) {
      addLog(`Batch ingestion error: ${err.message}`, 'error');
    }
  });

  btnDryRun.addEventListener('click', async () => {
    addLog(`Running DRY-RUN simulation for corpus_extracted/...`, 'info');
    try {
      const res = await fetch('/api/ingest/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dir_path: 'corpus_extracted',
          format: formatSelect.value,
          dry_run: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Dry-run failed');

      const files = data.data.processed_files || [];
      const totalChunks = files.reduce((acc, f) => acc + (f.chunks_count || 0), 0);
      addLog(`[DRY-RUN SUCCESS] Simulated ${files.length} document(s), generated ${totalChunks} hierarchical chunks without database writes.`, 'success');
    } catch (err) {
      addLog(`Dry-run error: ${err.message}`, 'error');
    }
  });



  // Modal Ingest Button
  btnModalIngest.addEventListener('click', () => {
    if (currentActiveFile) {
      ingestSingle(currentActiveFile, modalDocTitle.textContent);
      inspectorModal.classList.add('hidden');
    }
  });

  // --- Modal Navigation ---
  function closeModal() {
    inspectorModal.classList.add('hidden');
  }
  btnCloseModal.addEventListener('click', closeModal);
  btnModalClose.addEventListener('click', closeModal);

  // Tabs Switcher
  tabBtnChunks.addEventListener('click', () => switchTab('chunks'));
  tabBtnPayload.addEventListener('click', () => switchTab('payload'));
  tabBtnGraph.addEventListener('click', () => switchTab('graph'));

  function switchTab(tab) {
    [tabBtnChunks, tabBtnPayload, tabBtnGraph].forEach(b => b.classList.remove('active'));
    [tabContentChunks, tabContentPayload, tabContentGraph].forEach(p => p.classList.add('hidden'));

    if (tab === 'chunks') {
      tabBtnChunks.classList.add('active');
      tabContentChunks.classList.remove('hidden');
    } else if (tab === 'payload') {
      tabBtnPayload.classList.add('active');
      tabContentPayload.classList.remove('hidden');
    } else if (tab === 'graph') {
      tabBtnGraph.classList.add('active');
      tabContentGraph.classList.remove('hidden');
    }
  }

  // --- Upload Modal ---
  btnOpenUpload.addEventListener('click', () => uploadModal.classList.remove('hidden'));
  btnCloseUpload.addEventListener('click', () => uploadModal.classList.add('hidden'));

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('upload-file-input');
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('act_name', document.getElementById('upload-act-name').value);

    addLog(`Uploading ${file.name} to corpus_extracted/...`, 'info');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');

      addLog(`File ${file.name} uploaded successfully and registered in corpus_index.csv!`, 'success');
      uploadModal.classList.add('hidden');
      uploadForm.reset();
      fetchCorpus();
    } catch (err) {
      addLog(`Upload error: ${err.message}`, 'error');
    }
  });

  // Toolbar & Logs
  btnRefresh.addEventListener('click', () => {
    fetchHealth();
    fetchCorpus();
  });

  btnClearLogs.addEventListener('click', () => {
    terminalBody.innerHTML = '<div class="log-line log-info">[Console cleared]</div>';
  });

  // Initial Load
  fetchHealth();
  fetchCorpus();
});
