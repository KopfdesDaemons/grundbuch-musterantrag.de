import PizZip from 'pizzip';
import * as fs from 'fs';

class OdtTemplater {
  private zip: PizZip;
  private contentXml: string;

  constructor(templatePath: string) {
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }
    const content = fs.readFileSync(templatePath, 'binary');
    this.zip = new PizZip(content);

    const file = this.zip.files['content.xml'];
    if (!file) {
      throw new Error('content.xml not found in the ODT file.');
    }
    this.contentXml = file.asText();
  }

  /**
   * Retrieves the value from a nested object based on a dot-separated path.
   * E.g., for path 'user.name', it retrieves data['user']['name'].
   * @param data The object to retrieve the value from.
   * @param path The dot-separated path string.
   * @returns The value at the specified path or undefined if not found.
   */
  private _getValueFromPath(data: any, path: string): string | undefined | boolean {
    const keys = path.split('.');
    let value = data;

    for (const key of keys) {
      if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, key)) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value as string | undefined | boolean;
  }

  /**
   * Removes Tags from within placeholders in the template.
   * E.g., {<text:span>key</text:span>} becomes {key}
   */
  private _removeTagsFromTemplate(): void {
    const variableWithTagsRegex = /\{([^}]*)\}/g;

    this.contentXml = this.contentXml.replace(variableWithTagsRegex, (_match, innerContent) => {
      const cleanedContent = innerContent.replace(/<[^>]+>/g, '');
      return `{${cleanedContent}}`;
    });
  }

  /**
   * Processes conditionals in the ODT content.
   * E.g., {#key == value}...{/} will include the content if key equals value.
   * @param data The object containing the placeholder values.
   */
  private _processConditionals(data: { [key: string]: any }): void {
    const conditionRegex = /\{#\s*([^\\{}]+?)\s*==\s*(.*?)\}(.*?)\{\/\}/gs;
    this.contentXml = this.contentXml.replace(conditionRegex, (_match, key: string, value: string, content: string): string => {
      const actualValue = this._getValueFromPath(data, key);
      return actualValue?.toString() === value ? content : '';
    });
  }

  /**
   * Processes empty conditionals in the ODT content.
   * E.g., {#key }...{/} will include the content if key is non-empty.
   * @param data The object containing the placeholder values.
   */
  private _processEmptyConditionals(data: { [key: string]: any }): void {
    const emptyConditionRegex =
      /<text:p(?:(?!<text:p)[\s\S])*?\{#\s*(.*?)\s*\}<.*?\/text:p>(<text:p[\s\S]*?)<text:p(?:(?!<text:p)[\s\S])*?\{\/\}.*?<\/text:p>/gs;
    this.contentXml = this.contentXml.replace(emptyConditionRegex, (_match, key: string, content: string): string => {
      const actualValue = this._getValueFromPath(data, key);
      return actualValue !== null && actualValue !== undefined && actualValue !== '' && actualValue !== false ? content : '';
    });
  }

  /**
   * Replaces placeholders in the ODT content with their corresponding values.
   * E.g., {user.name} will be replaced with the value of data.user.name.
   * @param data The object containing the placeholder values.
   */
  private _replacePlaceholders(data: { [key: string]: any }): void {
    const variableRegex = /\{([^#/]*?)\}/g;
    this.contentXml = this.contentXml.replace(variableRegex, (_match: string, path: string): string => {
      const value = this._getValueFromPath(data, path.trim());
      return value !== null && value !== undefined ? String(value) : '';
    });
  }

  /**
   * Replaces placeholders and processes conditional blocks in the ODT content.
   * @param data The object containing the placeholder values.
   */
  public replaceVariables(data: { [key: string]: any }): void {
    this._removeTagsFromTemplate();
    this._processConditionals(data);
    this._processEmptyConditionals(data);
    this._replacePlaceholders(data);
  }

  /**
   * Generates a new ODT file with the updated content.
   * @param outputPath The path where the new file should be saved.
   */
  public generate(outputPath: string): void {
    this.zip.file('content.xml', this.contentXml);
    const newZipContent = this.zip.generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, newZipContent);
  }
}

export default OdtTemplater;
