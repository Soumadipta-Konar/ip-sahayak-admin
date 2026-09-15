from app.services.classification_engine import FormulationEngine, ClassificationInput

def test_classical_medicine():
    data = ClassificationInput(
        is_first_schedule=True,
        is_modified=False,
        intended_use="medicinal",
        is_purified=False
    )
    result = FormulationEngine.classify(data)
    assert result.classification_title == "Generic Classical Medicine"
    assert "BARRED" in result.patent_risk

def test_phytopharmaceutical():
    data = ClassificationInput(
        is_first_schedule=False,
        is_modified=True,
        intended_use="medicinal",
        is_purified=True
    )
    result = FormulationEngine.classify(data)
    assert result.classification_title == "Phytopharmaceutical Drug (Rule 122-E)"
    assert "PATENTABLE" in result.patent_risk

def test_ayurveda_aahar():
    data = ClassificationInput(
        is_first_schedule=True,
        is_modified=True,
        intended_use="food",
        is_purified=False
    )
    result = FormulationEngine.classify(data)
    assert result.classification_title == "Ayurveda-Aahar (Nutraceutical)"
    assert "Not Patentable" in result.patent_risk

def test_proprietary_medicine():
    data = ClassificationInput(
        is_first_schedule=False,
        is_modified=False,
        intended_use="medicinal",
        is_purified=False
    )
    result = FormulationEngine.classify(data)
    assert result.classification_title == "Patent-or-Proprietary (P&P) Medicine"
    assert "Sec 3(e)" in result.patent_risk
