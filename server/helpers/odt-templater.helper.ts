import PizZip from 'pizzip';
import * as fs from 'fs';

// Define a type for the data object to support nested properties
type DataObject = { [key: string]: any };

class OdtTemplater {
  private zip: PizZip;
  private contentXml: string | null = null;

  constructor(templatePath: string) {
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }
    const content = fs.readFileSync(templatePath, 'binary');
    this.zip = new PizZip(content);
  }

  /**
   * Loads the content.xml file from the ODT archive.
   * @private
   */
  private loadContentXml(): void {
    const file = this.zip.files['content.xml'];
    if (!file) {
      throw new Error('content.xml not found in the ODT file.');
    }
    this.contentXml = file.asText();
  }

  /**
   * Replaces placeholders and processes conditional blocks in the ODT content.
   * @param {DataObject} data The object containing the placeholder values.
   */
  public replaceVariables(data: DataObject): void {
    if (!this.contentXml) {
      this.loadContentXml();
    }

    let newContentXml = this.contentXml as string;

    // Process conditional blocks: {#variable == "value"}...{/}
    const conditionRegex = /\{#(.*?)\s*==\s*"(.*?)"\}(.*?)\{\/\}/gs;

    newContentXml = newContentXml.replace(conditionRegex, (_match, key: string, value: string, content: string): string => {
      const path = key.split('.');
      let actualValue: any = data;

      for (const p of path) {
        if (actualValue && typeof actualValue === 'object' && Object.prototype.hasOwnProperty.call(actualValue, p)) {
          actualValue = actualValue[p];
        } else {
          actualValue = undefined;
          break;
        }
      }

      if (actualValue?.toString() === value) {
        return content;
      } else {
        return '';
      }
    });

    // Replace normal placeholders: {...}
    const variableRegex = /{(.*?)}/g;
    newContentXml = newContentXml.replace(variableRegex, (_match: string, p1: string): string => {
      // Split the path by '.' to support nested properties e.g. "user.name"
      const path = p1.trim().split('.');
      let value: any = data;

      for (const key of path) {
        if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, key)) {
          // Remember key to access nested properties
          value = value[key];
        } else {
          return '';
        }
      }
      return value !== undefined && value !== null ? (value.toString() as string) : '';
    });

    this.zip.file('content.xml', newContentXml);
  }

  /**
   * Generates a new ODT file with the updated content.
   * @param {string} outputPath The path where the new file should be saved.
   */
  public generate(outputPath: string): void {
    const newZipContent = this.zip.generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, newZipContent);
  }
}

export default OdtTemplater;
