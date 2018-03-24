import { shallow } from '@vue/test-utils'
import Phone from '../src/components/Phone.vue'
import { format } from 'libphonenumber-js'
import lengths from '../src/assets/lengths.js'

const factory = (values = {}) => {
    return shallow(Phone, {
      data: { ...values  }
    })
};

describe('Phone', () => {
    describe('user interaction', () => {
        it('should not show flags on render', () => {
            const wrapper = factory();
            expect(wrapper.vm.showFlags).toBe(false);
        });

        it('should show flags on click', () => {
            const wrapper = factory();
            wrapper.find('.active-flag').trigger('click');
            expect(wrapper.vm.showFlags).toBe(true);
        });

        it('should close flags on selecting', () => {
            const wrapper = factory({ showFlags: true });
            wrapper.find('.tel-input-item').trigger('click');
            expect(wrapper.vm.showFlags).toBe(false);
        });
    });

    describe('formatting', () => {
        it('should format phone', () => {
            const tel = '+16186190000';
            const wrapper = factory({ tel });

            wrapper.vm.onInput();
            expect(wrapper.vm.tel).toBe(format(tel, '', 'International'));
        });

        it('should remove excess digits', () => {
            const tel = '+161861900000';
            const wrapper = factory({ tel });

            wrapper.vm.onInput();
            expect(wrapper.vm.meta.parsed_input.length).toBe(lengths['us'] + 1);
        });

        it('should set default input', () => {
            const wrapper = factory({ activeFlag: 'lv' });

            wrapper.vm.onInput();
            expect(wrapper.vm.defaultValue).toBe('+371');
        });

        it('should format input back to default on delete', () => {
            const wrapper = factory({ activeFlag: 'gb' });
            wrapper.setData({ tel: '' });
            wrapper.vm.onInput();
            expect(wrapper.vm.tel).toBe('+44');
        });

        it('should show default value on focus', () => {
            const wrapper = factory({ activeFlag: 'gb' });
            wrapper.find('input').trigger('focus');
            expect(wrapper.find('input').element.value).toBe('+44');
        });

        it('show placeholder on blurring default value', () => {
            const wrapper = factory({ activeFlag: 'gb', tel: '+44' }); 
            wrapper.find('input').trigger('blur');  
            expect(wrapper.vm.tel).toBe('');
        });
    });

    describe('change flag', () => {
        it('should change flag on select', () => {
            const wrapper = factory({ activeFlag: 'us' });
            wrapper.vm.selectFlag([ 'test', 'ca' ]);
            expect(wrapper.vm.activeFlag).toBe('ca');
        });

        it('should change flag when input matches pattern', () => {
            const wrapper = factory({ activeFlag: 'gb', tel: '+16186190000' });
            wrapper.vm.onInput();
            expect(wrapper.vm.activeFlag).toBe('us');
        });

        it('should follow more complex pattern with matching codes', () => {
            const wrapper = factory({ tel: '+1268' });
            wrapper.vm.onInput();
            expect(wrapper.vm.activeFlag).toBe('ag');
        });
    });

    describe('emit events', () => {
        it('should not emit input on render', () => {
            const wrapper = factory({ tel: '+1' });
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it('should emit input on input event', () => {
            const wrapper = factory({ tel: '+1' });
            wrapper.vm.onInput();
            expect(wrapper.emitted().input).toBeTruthy();
        });
    });
});