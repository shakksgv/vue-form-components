import { shallow } from '@vue/test-utils'
import Email from '../src/components/Email.vue'

const factory = (values = {}) => {
    return shallow(Email, {
      data: { ...values  }
    })
};

describe('Email', () => {
    describe('react to user input', () => {
        it('should show autocomplete after "@"', () => {
            const wrapper = factory({ email: 'test@', focused: true });
            expect(wrapper.vm.showAc).toBe(true);
        });

        it('shoud not show autocomplet if only "@" is present', () => {
            const wrapper = factory({ email: '@', focused: true });
            expect(wrapper.vm.showAc).toBe(false);
        });
    
        it('should not show autocomplete if not focused', () => {
            const wrapper = factory({ email: 'test@', focused: false });
            expect(wrapper.vm.showAc).toBe(false);
        });
    });

    describe('validation', () => {
        it('should validate empty email', () => {
            const wrapper = factory({ email: '' });
            expect(wrapper.vm.valid).toBe(false);
        });

        it('should validate correct email', () => {
            const wrapper = factory({ email: 'test@test.com' });
            expect(wrapper.vm.valid).toBe(true);
        });

        it('should validate incorrect email', () => {
            const wrapper = factory({ email: 'test@test' });
            expect(wrapper.vm.valid).toBe(false);
        });

        it('regexp check', () => {
            const wrapper = factory();
            const regExp = wrapper.vm.regExp;

            expect(regExp.test('')).toBe(false);            
            expect(regExp.test('test@')).toBe(false);
            expect(regExp.test('test@test')).toBe(false); 
            
            expect(regExp.test('test@test.com')).toBe(true);
            expect(regExp.test('test@test.gov.com')).toBe(true);
        });
    });

    describe('methods', () => {
        it('should detect when focused', () => {
            const wrapper = factory();
            wrapper.find('input').trigger('focus');
            expect(wrapper.vm.focused).toBe(true);
        });

        it('should detect when blurred', () => {
            const wrapper = factory({ focused: true });
            wrapper.find('input').trigger('blur');
            expect(wrapper.vm.focused).toBe(false);
        });

        it('should increase focus index', () => {
            const wrapper = factory({ domainFocus: 0 });
            wrapper.vm.keyDown();
            expect(wrapper.vm.domainFocus).toBe(1);
        });

        it('should reset to 0 when reaching last element', () => {
            const wrapper = factory({ domains: [1, 2], domainFocus: 1 });
            wrapper.vm.keyDown();
            expect(wrapper.vm.domainFocus).toBe(0);
        });

        it('should decresase focus index', () => {
            const wrapper = factory({ domainFocus: 2 });
            wrapper.vm.keyUp();
            expect(wrapper.vm.domainFocus).toBe(1);
        });

        it('should reset to 0 when reaching last element', () => {
            const wrapper = factory({ domains: [1, 2], domainFocus: 0 });
            wrapper.vm.keyUp();
            expect(wrapper.vm.domainFocus).toBe(1);
        });

        it('should select item', () => {
            const wrapper = factory({ email: 'test@', domains: ['google.com', 'yandex.com'], domainFocus: 0, focused: true });
            wrapper.vm.select();
            expect(wrapper.vm.email).toBe('test@google.com');
        });
    });

    describe('events', () => {
        it('should not emit "input" on email on render', () => {
            const wrapper = factory({ domainFocus: 0 });
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it('should emit "input" on input', () => {
            const wrapper = factory({ email: 'test@', focused: true });
            wrapper.find('input').trigger('input');
            expect(wrapper.emitted().input).toBeTruthy();
        });

        it('should emit "input" on select', () => {
            const wrapper = factory({ email: 'test@', focused: true });
            wrapper.vm.select();
            expect(wrapper.emitted().input).toBeTruthy();
        });
    });
});