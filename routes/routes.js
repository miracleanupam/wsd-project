import { Router } from '../deps.js';

import * as reportApi from './apis/reportApi.js';
import * as authApi from './apis/authApi.js';
import * as reportController from './controllers/reportController.js';
import * as authController from './controllers/authController.js';

const router = new Router();

// UI Routes
// router.get('/', reportController.hello);
router.get('/behaviour/reporting', reportController.homePageForLoggedInUsers);
router.get('/', reportController.homePageForAllUsers);
router.get('/report-morning', reportController.reportMorningData);
router.post('/report-morning', reportController.insertMornData);
router.get('/report-evening', reportController.reportEveningData);
router.post('/report-evening', reportController.insertEveData);
router.get('/behaviour/summary', reportController.summaryPage);
router.get('/auth/register', authController.showRegistrationForm);
router.post('/auth/register', authController.registerUser);
router.get('/auth/login', authController.showLoginForm);
router.post('/auth/login', authController.loginUser);
router.get('/auth/logout', authController.logoutUser);
router.post('/behaviour/summary/week', reportController.getWeekReport);
router.post('/behaviour/summary/month', reportController.getMonthReport);

// API routes
router.post('/api/report-morning', reportApi.addMorning);
router.post('/api/report-evening', reportApi.addEvening);
router.get('/api/summary-last-week', reportApi.getLastWeekSummary);
router.get('/api/summary-last-month', reportApi.getLastMonthSummary);
router.get('/api/summary/:year/:month/:day', reportApi.getSummaryDay);

// API for authentication
router.post('/api/auth/register', authApi.userRegistration);
router.post('/api/auth/login', authApi.userLogin);
router.get('/api/auth/logout', authApi.userLogout);

export { router };
