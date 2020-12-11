import { addEveningReport,
    addMorningReport,
    updateMorningReport,
    updateEveningReport,
    getAverageLast,
    getMoodTrend,
    getTodayReportCount,
    getSummaryForGivenWeek,
    getSummaryForGivenMonth,
} from '../../services/reportServices.js';
import { 
    validate,
    required,
    isNumber,
    isInt,
    lengthBetween,
    isEmail,
    minLength,
    minNumber,
    numberBetween,
    isDate,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const mornValidationRules = {
    sleepHours: [isNumber, required, minNumber(0)],
    sleepQuality: [isInt, numberBetween(1, 5)],
    mood: [isInt, numberBetween(1, 5)],
    reportFor: [required, isDate]
};


const eveValidationRules = {
    mood: [isInt, numberBetween(1, 5)],
    sportsHours: [isNumber, required, minNumber(0)],
    studyHours: [isNumber, required, minNumber(0)],
    eatingQuality: [isInt, numberBetween(1, 5)],
    reportFor: [required, isDate]
};

const summaryPage = async({ request, response, render, session }) => {
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const resWeek = await getAverageLast(userId);
    const resMonth = await getAverageLast(userId, 'm');

    render('./summary.ejs', { 
        errors: {},
        userEmail:userEmail,
        avgLastWeek: resWeek,
        avgLastMonth: resMonth,
    });
};


const homePageForAllUsers = async ({ request, response, render, session }) => {
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession ? userDetailsFromSession.id : null;
    const userEmail = userDetailsFromSession ? userDetailsFromSession.email : null;

    let mT = null;
    let mY = null;
    let trend = null;
    if (userId) {
    }
    if (userEmail) {
    }
    if (userEmail) {
    }

    if (userEmail) {
        const moodToday = await getMoodTrend(userId);

        if (moodToday.length > 0) {
            mT = Number(moodToday[0].avg_mood);
        } else {
            mT = 'No data to show';
        }
        const moodYesterday = await getMoodTrend(userId, 'y');
        if (moodYesterday.length > 0) {
            mY = Number(moodYesterday[0].avg_mood);
        } else {
            mY = 'No data to show';
        }

        if (typeof mT === "number" && typeof mY === "number") {
            if (mT > mY) {
                trend = "Things are looking bright today";
            } else {
                trend = "Things are looking gloomy today";
            }
        } else {
            trend = "Not available when there is no data";
        }
    }

    render('./homePageForAllUsers.ejs', { userEmail: userEmail, mToday: mT, mYesterday: mY, trend: trend });
}

const homePageForLoggedInUsers = async ({ render, session }) => {
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const resReportCounts = await getTodayReportCount();
    const hasReportedIn = { morning: resReportCounts.count_morn > 0 ? true : false, evening: resReportCounts.count_eve > 0 ? true : false };
   
    render('./landingForUsers.ejs', { 
        errros: {},
        userEmail: userEmail,
        hasReportedIn: hasReportedIn,
    });
};

let defaultMornData = {
    sleepHours: null,
    sleepQuality: null,
    mood: null,
    reportFor: null,
};

const reportMorningData = async ({ request, response, render, session }) => {
    defaultMornData = {
        sleepQuality: null,
        sleepHours: null,
        mood: null,
        reportFor: null,
    };
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;
    render('./morning.ejs', { errors: [], userEmail: userEmail, defaultMornData: defaultMornData });
};

const insertMornData = async ({ request, render, params, response, session }) => {
    defaultMornData = {
        sleepQuality: null,
        sleepHours: null,
        mood: null,
        reportFor: null,
    };
    const body = request.body();
    const docs = await body.value;


    const mornData = {
        sleepHours: Number(docs.get('sleep_hours')),
        sleepQuality: Number(docs.get('sleep_quality')),
        mood: Number(docs.get('mood')),
        reportFor: docs.get('report_for')
    };

    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const [passes, errors] = await validate(mornData, mornValidationRules);

    if (passes) {
        const res = await addMorningReport(mornData, userId);

        if (!res) {
            errors: ['Something went wrong'];
            defaultMornData = {
                sleepQuality: mornData.sleepQuality,
                sleepHours: mornData.sleepHours,
                mood: mornData.mood,
                reportFor: mornData.reportFor,
            };
        } else {
            response.redirect('/behaviour/reporting');
        }
    } else {
        defaultMornData = {
            sleepQuality: mornData.sleepQuality,
            sleepHours: mornData.sleepHours,
            mood: mornData.mood,
            reportFor: mornData.reportFor,
        };
    }

    render('./morning.ejs', { errors: errors, userEmail: userEmail, defaultMornData: defaultMornData });
};

let defaultEveningData = {
    sportsHours: null,
    studyHours: null,
    eatingQuality: null,
    mood: null,
    reportFor: null,
};

const insertEveData = async ({ request, response, render, params, session }) => {
    defaultEveningData = {
        sportsHours: null,
        studyHours: null,
        eatingQuality: null,
        mood: null,
        reportFor: null,
    };

    const body = request.body();
    const docs = await body.value;

    const eveData = {
        sportsHours: Number(docs.get('sports_hours')),
        studyHours: Number(docs.get('study_hours')),
        eatingQuality: Number(docs.get('eating_quality')),
        mood: Number(docs.get('mood')),
        reportFor: docs.get('report_for')
    };

    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const [passes, errors] = await validate(eveData, eveValidationRules);

    if (passes) {
        const res = await addEveningReport(eveData, userId);

        if (!res) {
            errors: ['Something went wrong'];
            defaultEveningData = {
                sportsHours: eveData.sportsHours,
                studyHours: eveData.studyHours,
                eatingQuality: eveData.eatingQuality,
                mood: eveData.mood,
                reportFor: eveData.reportFor,
            };
        } else {
            response.redirect('/behaviour/reporting');
        }
    } else {
        defaultEveningData = {
            sportsHours: eveData.sportsHours,
            studyHours: eveData.studyHours,
            eatingQuality: eveData.eatingQuality,
            mood: eveData.mood,
            reportFor: eveData.reportFor,
        };
    }

    render('./evening.ejs', { errors: errors, userEmail: userEmail, defaultEveningData: defaultEveningData });
};

const reportEveningData = async ({ request, response, render, session }) => {
    defaultEveningData = {
        sportsHours: null,
        studyHours: null,
        eatingQuality: null,
        mood: null,
        reportFor: null,
    };
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;
    render('./evening.ejs', { errors: {}, userEmail: userEmail, defaultEveningData: defaultEveningData });
};

const getWeekReport = async ({ request, response, render, session }) => {
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const body = request.body();
    const docs = await body.value;

    let errors = null;
    let year = null;
    let weekNo = null;
    let res = null;
    if (!docs.get('week_no')) {
        errors = { notFound: ['Data not found'] };
    } else {
        year = Number(docs.get('week_no').split('-')[0]);
        weekNo = Number(docs.get('week_no').split('-')[1].split('W')[1]);

        res = await getSummaryForGivenWeek(userId, weekNo, year);

        if (!res) {
            errors = { notFound: ['Data not found'] };
        } else if (!res.avg_sports & !res.avg_study & !res.avg_sleep & !res.avg_sleep_quality & !res.avg_eating & res.avg_mood==="0") {
            errors = { notFound: ['Data not found'] };
        }
    }

    render('./week.ejs', { userEmail: userEmail, weekNo: weekNo, year: year, errors: errors, summaryData: res } );
};

const getMonthReport = async ({ request, response, render, session }) => {
    const userDetailsFromSession = await session.get('user');
    const userId = userDetailsFromSession.id;
    const userEmail = userDetailsFromSession.email;

    const body = request.body();
    const docs = await body.value;

    const year = Number(docs.get('month_no').split('-')[0]);
    const monthNo = Number(docs.get('month_no').split('-')[1]);

    const res = await getSummaryForGivenMonth(userId, monthNo, year);


    let errors = null;
    if (!res) {
        errors = { notFound: ['Data not found'] };
    } else if (!res.avg_sports & !res.avg_study & !res.avg_sleep & !res.avg_sleep_quality & !res.avg_eating & res.avg_mood==="0") {
        errors = { notFound: ['Data not found'] };
    } else {
    }

    if (errors) {
    } else {
    }
    render('./month.ejs', { userEmail: userEmail, monthNo: monthNo, year: year, errors: errors, summaryData: res } );
};

export { 
    homePageForAllUsers,
    homePageForLoggedInUsers,
    reportMorningData,
    reportEveningData,
    insertMornData,
    insertEveData,
    summaryPage,
    getWeekReport,
    getMonthReport,
};

