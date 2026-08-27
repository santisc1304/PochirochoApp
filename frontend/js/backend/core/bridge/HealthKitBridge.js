/**
 * HealthKitBridge.js
 * Adaptador de importación y procesamiento de datos exportados de Apple Health (XML/JSON)
 */

export class HealthKitBridge {
  static parseHealthKitXML(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const records = xmlDoc.getElementsByTagName('Record');
    
    const cycleEntries = [];
    const symptomEntries = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const type = record.getAttribute('type');
      const startDate = record.getAttribute('startDate');
      const value = record.getAttribute('value');

      if (type === 'HKCategoryTypeIdentifierMenstrualFlow') {
        cycleEntries.push({
          fecha: startDate,
          nivelSangrado: value || 'Unspecified'
        });
      } else if (type === 'HKQuantityTypeIdentifierBasalBodyTemperature') {
        symptomEntries.push({
          fecha: startDate,
          temperaturaBasal: parseFloat(value)
        });
      }
    }

    return {
      ciclosImportados: cycleEntries,
      sintomasImportados: symptomEntries
    };
  }

  static parseHealthKitJSON(jsonData) {
    if (typeof jsonData === 'string') {
      jsonData = JSON.parse(jsonData);
    }
    return {
      ciclosImportados: jsonData.cycles || [],
      sintomasImportados: jsonData.symptoms || []
    };
  }
}
