import { shallowMount } from '@vue/test-utils';
import FinopsSection from './finops-section.vue';

describe('FinopsSection', () => {
  it('opens external URL with correct query params', () => {
    const cargoStuffingNumber = 'ABC123';
    const transportDocumentNumbers = 'DEF456';
    const wrapper = shallowMount(FinopsSection, {
      propsData: { cargoStuffingNumber, transportDocumentNumbers },
    });

    // Mock window.open method
    const mockOpen = jest.fn();
    window.open = mockOpen;

    // Click on the link to open the URL
    wrapper.find('.finops-section__view-link').trigger('click');

    // Check that window.open was called with the correct URL and target
    const expectedUrl = `?EquipmentNumber=${cargoStuffingNumber}&CBLNumber=${transportDocumentNumbers}`;
    const expectedTarget = '_blank';
    expect(mockOpen).toHaveBeenCalledWith(expectedUrl, expectedTarget);
  });
});
