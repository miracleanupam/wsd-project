import * as reportService from '../../services/reportServices.js';

const addMorning = async ({ request, response, params, session, render }) => {
    const body = request.body();
    const docs = await body.value;

    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;


    // :TODO Change the userId from sesssion; to be implemented
    // const userId = 1

    const mornReport = {
        sleepHours: docs.get('sleep_hours'),
        sleepQuality: docs.get('sleep_quality'),
        mood: docs.get('mood'),
        reportFor: docs.get('report_for')
    };

    const res = await reportService.addMorningReport(mornReport, userId);
    if (!res) {
        response.body = 'Bad Request';
        response.status = 400;
        return;
    }
    response.body = 'Success';
    response.status = 200;
};

const addEvening = async ({ request, response, params, session, render }) => {
    const body = request.body();
    const docs = await body.value;

    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;


    // :TODO Change the userId from sesssion; to be implemented
    // const userId = 1;

    const eveReport = {
        sportsHours: docs.get('sports_hours'),
        studyHours: docs.get('study_hours'),
        eatingQuality: docs.get('eating_quality'),
        mood: docs.get('mood'),
        reportFor: docs.get('report_for'),
    };

    const res = await reportService.addEveningReport(eveReport, userId);
    if (!res) {
        response.status = 400;
        response.body = 'Bad Request';
        return;
    }
    response.status = 200;
    response.body = 'Success';
    return;
};

const getLastWeekSummary = async ({ request, render, response, session, params }) => {
    // :TODO Change the userId from sesssion; to be implemented
    // const userId = 1;
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;


    const res = await reportService.getAverageLast(userId);
    if (!res) {
        response.body = 'Bad Request';
        response.status = 400;
        return;
    }
    response.status = 200;
    response.body = res;
    return;
};


const getLastMonthSummary = async ({ request, render, response, session, params }) => {
    // :TODO Change the userId from sesssion; to be implemented
    // const userId = 1;
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;


    const res = await reportService.getAverageLast(userId, 'm');
    if (!res) {
        response.status = 400;
        response.body = 'Bad Request';
        return;
    }
    response.status = 200;
    response.body = res;
    return;
};

const getSummaryDay = async ({ request, response, params, session }) => {
    // :TODO Change the userId from sesssion; to be implemented

    // const userId = 1;
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const year = params.year;
    const month = params.month;
    const day = params.day;

    const date = new Date(`${year}-${month}-${day}`);

    const res = await reportService.getSummaryForDay(userId, date);
    if (!res) {
        response.status = 400;
        response.body = 'Bad Request';
        return;
    }
    response.status = 200;
    response.body = res;
    return;
};

const getWeekReport = async ({ request, response, params, session }) => {
    response.status = 200;
};


export { addMorning,
    addEvening,
    getLastWeekSummary,
    getLastMonthSummary,
    getWeekReport,
    getSummaryDay,
};
