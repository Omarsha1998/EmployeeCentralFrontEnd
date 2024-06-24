import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import helperMethods from "../helperMethods.js";
import Store from "../store/index.js"
import { Cookies } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: [
      {
        path: '/',
        redirect: '/announcements',
        component: () => import('layouts/MainLayout.vue'),
        children: [
          {
            path: '/announcements',
            name: '/Announcements',
            meta: {
              title: "Announcements",
              requiresAuth: true,
            },
            component: () => import('src/pages/Announcements.vue')
          },
          {
            path: '/other-request',
            name: '/OtherRequest',
            meta: {
              title: "Other Request",
              requiresAuth: true,
            },
            component: () => import('src/pages/OtherRequest.vue')
          },
          {
            path: '/my-request',
            name: '/MyRequest',
            meta: {
              title: "My Request",
              requiresAuth: true,
            },
            component: () => import('src/pages/MyRequest.vue')
          },
          {
            path: '/personal-information',
            name: 'PersonalInformation',
            meta: {
              title: "Personal Information",
              requiresAuth: true,
            },
            component: () => import('src/pages/PersonalInformation.vue')
          },
          {
            path: '/family-background',
            name: 'FamilyBackground',
            meta: {
              title: "Family Background",
              requiresAuth: true,
            },
            component: () => import('src/pages/FamilyBackground.vue')
          },
          {
            path: '/educational-background',
            name: 'EducationalBackground',
            meta: {
              title: "Educational Background",
              requiresAuth: true,
            },
            component: () => import('src/pages/EducationalBackground.vue')
          },
          {
            path: '/training-or-seminar',
            name: 'TrainingOrSeminar',
            meta: {
              title: "Training/Seminar",
              requiresAuth: true,
            },
            component: () => import('src/pages/TrainingOrSeminar.vue')
          },
          {
            path: '/work-experience',
            name: 'WorkExperience',
            meta: {
              title: "Work Experience",
              requiresAuth: true,
            },
            component: () => import('src/pages/WorkExperience.vue')
          },
          {
            path: '/attachment-archive',
            name: 'AttachmentArchive',
            meta: {
              title: "Attachment Archive",
              requiresAuth: true,
            },
            component: () => import('src/pages/AttachmentArchive.vue')
          },
          {
            path: '/export-personal-information',
            name: 'ExportPersonalInformation',
            meta: {
              title: "Export Personal Information",
              requiresAuth: true,
            },
            component: () => import('src/pages/ExportPersonalInformation.vue')
          },
          {
            path: '/license',
            name: 'License',
            meta: {
              title: "License",
              requiresAuth: true,
            },
            component: () => import('src/pages/License.vue')
          },
          {
            path: '/maintenance',
            name: 'Maintenance',
            meta: {
              title: "Maintenance",
              requiresAuth: true,
            },
            component: () => import('src/pages/Maintenance.vue')
          },
          {
            path: '/Leave',
            meta: {
              title: "My Leaves",
              requiresAuth: true,
            },
            children: [{ path: '', component: () => import('src/pages/LeaveDetails.vue') }],
          },
          {
            path: '/LeaveOperation',
            meta: {
              title: "Leave Authorization",
              requiresAuth: true,
            },
            children: [{ path: '', component: () => import('src/pages/LeaveOperation.vue') }],
          },
          {
            path: '/MyDTR',
            meta: {
              title: "MY DTR",
              requiresAuth: true,
            },
            children: [{ path: '', component: () => import('src/pages/DTRPage.vue') }],
          },
          {
            path: '/CanceledLeave',
            meta: {
              title: 'Canceled Leave Authorization',
              requiresAuth: true,
            },
            children: [{ path: '', component: () => import('src/pages/CancelLeave.vue')}],
          },
          {
            path: '/EmployeeDetails',
            meta: {
              title: 'Employee Leave Details',
              requiresAuth: true,
            },
            children: [{ path: '', component: () => import('src/pages/EmployeeDetails.vue')}],
          }
        ]
      },
      {
        path: '/account/login/:userHash?',
        name: 'Login',
        meta: {
          title: "Login"
        },
        component: () => import('pages/Login.vue')
      },
      {
        path: '/update-license',
        name: 'UpdateLicense',
        meta: {
          title: "Update License",
          requiresAuth: true
        },
        component: () => import('pages/UpdateLicense.vue')
      },
      {
        // path: '/:catchAll(.*)*',
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        meta: {
          title: "Page Not Found"
        },
        component: () => import('src/pages/PageNotFound.vue')
      },
    ]
  })

  Router.beforeEach(async (to, from, next) => {
    helperMethods.setPageTitle(to.meta.title + " - " + process.env.APP_NAME);
    let tofullPathLowerCase = to.fullPath.toLowerCase();

     // #region Validation_SetUserDetails
    if (helperMethods.getCookie('token') !== undefined && !Store.getters['user_module/has_all_values']) await Store.dispatch('user_module/setNewValues', helperMethods.getCookie('token'));
    // #endregion

    if (to.matched.some(record => record.meta.requiresAuth)) {

      // #region Validation_IsNotAuthenticated
      if (!Store.getters['user_module/has_all_values']) return next('/account/login');
      // #endregion

      // #region Validation_IsNotLicensed
      if (!Store.getters['user_module/is_license'] && 
           (tofullPathLowerCase.includes("/license") || tofullPathLowerCase.includes("/update-license"))
          ) return next('/');
      // #endregion

      // #region Validation_DoNotHavePISAccess
      const allowedRoutes = [
        '/other-request',
        '/my-request',
        '/personal-information',
        '/family-background',
        '/educational-background',
        '/license',
        '/update-license',
        '/training-or-seminar',
        '/attachment-archive',
        '/export-personal-information',
        '/maintenance'
      ];   
      const isRestrictedRoute = allowedRoutes.some(route => tofullPathLowerCase.includes(route));
      if (!Store.getters['user_module/has_pis_access'] && isRestrictedRoute) return next('/');
      // #endregion

      // #region Validation_IsLicensed
      if (Store.getters['user_module/is_license'] && Store.getters['user_module/has_pis_access']) {

        if (Store.getters['licenses_module/licenses'] === null) await Store.dispatch('licenses_module/get', Store.getters['user_module/employee_id']);
        const dateToday = helperMethods.getDateToday();
        for (let index = 0; index < Store.getters['licenses_module/licenses'].length; ++index) { 
          const isLatestLicenseUploaded = Store.getters['licenses_module/licenses'][index].is_latest_license_uploaded;
          const licenseExpirationDate = Store.getters['licenses_module/licenses'][index].expiration_date;
          const totalDays = helperMethods.daysBetweenTwoDates(licenseExpirationDate, dateToday);

          if (totalDays <= process.env.START_NOTIF_DAYS
            &&
            !tofullPathLowerCase.includes("update-license")
            &&
            helperMethods.getCookie("not_exposed_notification_index") === undefined
            &&
            !isLatestLicenseUploaded) {

            if (helperMethods.getCookie("exposed_license_indexes") === undefined) helperMethods.createCookie("not_exposed_notification_index", index.toString());
            else {
              let array = helperMethods.getCookie("exposed_license_indexes").split(" ");
              if (!array.includes(index.toString())) helperMethods.createCookie("not_exposed_notification_index", index.toString());
            }

          }

        };
      }

      if (helperMethods.getCookie("not_exposed_notification_index") !== undefined && !tofullPathLowerCase.includes("update-license")) return next('/update-license');
      if (helperMethods.getCookie("not_exposed_notification_index") === undefined && tofullPathLowerCase.includes("update-license")) return next(from);
      // #endregion

      // #region Validation_IsNotHREmployee
      if (!Store.getters['user_module/is_pis_approver'] &&
        (tofullPathLowerCase.includes("/other-request") ||
          tofullPathLowerCase.includes("/attachment-archive") ||
          tofullPathLowerCase.includes("/export-personal-information") ||
          tofullPathLowerCase.includes("/maintenance")
        )
      ) return next('/my-request');
      // #endregion

      // #region Validation_IsNotApproverEmployee
        if (!Store.getters['user_module/is_leave_approver']
          &&
          tofullPathLowerCase.includes("leaveoperation")
          &&
          tofullPathLowerCase.includes("cancelleave")
        ) return next('/');
        // #endregion

      // #region Validation_IsUserDontHavePreviousWorkExperiences
      if (!Store.getters['user_module/has_work_experience'] 
        &&
        tofullPathLowerCase.includes("/work-experience")
      ) return next('/');
      // #endregion

      return next();
    } else {
      // #region Validation_IsAuthenticated
      if (Store.getters['user_module/has_all_values'] && tofullPathLowerCase.includes("/account/login")) return next(from);
      // #endregion
      return next();
    }
  });

  return Router
})
