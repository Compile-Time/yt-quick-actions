import { createApp } from 'vue';
import './style.css';
import OptionsPage from './OptionsPage.vue';
import i18n from '@/utils/i18n';

createApp(OptionsPage).use(i18n).mount('#app');
