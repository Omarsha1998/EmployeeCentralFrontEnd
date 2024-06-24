import { createStore, createLogger } from 'vuex';
import middleware  from './middleware.js'; 

import other_requests_module from './modules/other_requests_module';
import my_requests_module from './modules/my_requests_module';
import personal_informations_module from './modules/personal_informations_module';
import family_backgrounds_module from './modules/family_backgrounds_module';
import educational_backgrounds_module from './modules/educational_backgrounds_module';
import maintenance_module from './modules/maintenance_module';
import work_experiences_module from './modules/work_experiences_module';
import licenses_module from './modules/licenses_module';
import trainings_or_seminars_module from './modules/trainings_or_seminars_module';
import attachment_archive_module from './modules/attachment_archive_module';
import export_personal_information_module from './modules/export_personal_information_module';
import user_module from './modules/user_module';
import helpers from './helpers'
import leaveModule from './modules/leaveModule';
import announcementModule from './modules/announcementModule'
import DTRModule from './modules/DTRModule/index.js';
const plugins = [];


if (process.env.ENV_CONDITION === 'DEV') plugins.push(createLogger());

const Store = createStore({
  modules: {
    other_requests_module,
    my_requests_module,
    personal_informations_module,
    family_backgrounds_module,
    educational_backgrounds_module,
    work_experiences_module,
    licenses_module,
    trainings_or_seminars_module,
    attachment_archive_module,
    export_personal_information_module,
    maintenance_module,
    user_module,
    helpers,
    leaveModule,
    announcementModule,
    DTRModule
  },
  plugins: [...plugins, middleware],
})

export default Store
