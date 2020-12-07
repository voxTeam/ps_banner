// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION);

// Import BOBasePage
const ModuleConfigurationPage = versionSelectResolver.require('BO/modules/moduleConfiguration/index.js');

class PS_BANNER extends ModuleConfigurationPage.constructor {
  constructor() {
    super();

    this.updatedSettingSuccessfulMessage = 'The settings have been updated.';

    // Selectors
    this.titleBlock = 'h2.page-title';
    this.subtitleBlock = 'h4.page-subtitle';

    // Alert success selector
    this.alertSuccessBlock = '.alert-success.module_confirmation';

    // Form selectors
    this.moduleForm = '#module_form';
    this.bannerImageInput = langId => `#BANNER_IMG_${langId}-name`;
    this.bannerLinkInput = langId => `#BANNER_LINK_${langId}`;
    this.bannerDescriptionInput = langId => `#BANNER_DESC_${langId}`;
    this.saveButton = '#module_form_submit_btn';

    // Change languages selector
    this.dropdownLangButton = `${this.moduleForm} button.dropdown-toggle`;
    this.dropdownLangItemLink = langId => `#dropdown-lang-item-link-${langId}`;
  }

  // Functions

  /**
   * Change form language
   * @param page
   * @param langId
   * @return {Promise<void>}
   */
  async changeLanguage(page, langId) {
    await Promise.all([
      page.click(this.dropdownLangButton),
      this.waitForVisibleSelector(page, this.dropdownLangItemLink(langId)),
    ]);

    await page.click(this.dropdownLangItemLink(langId));
  }

  /**
   * Upload image for a specific language
   * @param page
   * @param imagePath
   * @param langId
   * @return {Promise<void>}
   */
  async uploadImagePath(page, imagePath, langId) {
    await this.uploadFile(page, this.bannerImageInput(langId), imagePath);
  }

  /**
   * Set link for a specific language
   * @param page
   * @param linkValue
   * @param langId
   * @return {Promise<void>}
   */
  async setBannerLink(page, linkValue, langId) {
    await this.setValue(page, this.bannerLinkInput(langId), linkValue);
  }

  /**
   * Set description for a specific language
   * @param page
   * @param description
   * @param langId
   * @return {Promise<void>}
   */
  async setBannerDescription(page, description, langId) {
    await this.setValue(page, this.bannerDescriptionInput(langId), description);
  }

  /**
   * Fill all inputs in form in a specific language
   * @param page
   * @param configuration
   * @return {Promise<void>}
   */
  async fillSpecificLanguageForm(page, configuration) {
    await this.changeLanguage(page, configuration.langId);
    await this.uploadImagePath(page, configuration.imagePath, configuration.langId);
    await this.setBannerLink(page, configuration.linkValue, configuration.langId);
    await this.setBannerDescription(page, configuration.description, configuration.langId);
  }


  /**
   * Configure module in 2 languages en and fr
   * @param page
   * @param configuration
   * @return {Promise<void>}
   */
  async configureModule(page, configuration) {
    // Fill form in lang=en
    await this.fillSpecificLanguageForm(page, configuration.en);

    // Fill form in lang=fr
    await this.fillSpecificLanguageForm(page, configuration.fr);

    // Save for and get successful message
    await this.clickAndWaitForNavigation(page, this.saveButton);

    return this.getTextContent(page, this.alertSuccessBlock);
  }
}
module.exports = new PS_BANNER();
