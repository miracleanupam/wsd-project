import { executeQuery } from '../database/database.js';

const addMorningReport = async (report, userId) => {
    try {
        await executeQuery("INSERT INTO reportings_morning as rp (report_for, sleep_hours, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (report_for, user_id) DO UPDATE SET sleep_hours=coalesce(excluded.sleep_hours, rp.sleep_hours), sleep_quality=coalesce(excluded.sleep_quality, rp.sleep_quality), mood=coalesce(excluded.mood, rp.mood);", report.reportFor, report.sleepHours, report.sleepQuality, report.mood, userId);
        return true
    } catch (e) {
        return false;
    }

    return report;
};

const addEveningReport = async (report, userId) => {
    try {
        await executeQuery("INSERT INTO reportings_evening as re (report_for, sports_hours, study_hours, eating_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (report_for, user_id) DO UPDATE SET sports_hours=coalesce(excluded.sports_hours, re.sports_hours), study_hours=coalesce(excluded.study_hours, re.study_hours), eating_quality=coalesce(excluded.eating_quality, re.eating_quality), mood=coalesce(excluded.mood, re.mood);", report.reportFor, report.sportsHours, report.studyHours, report.eatingQuality, report.mood, userId);
        return true;
    } catch (e) {
        return false;
    }

    return report;
};

const updateEveningReport = async (report, userId) => {
    try {
        await executeQuery("UPDATE reportings_evening set sports_hours=coalesce($1, sports_hours), study_hours=coalesce($2, study_hours), eating_quality=coalesce($3, eating_quality), mood=coalesce($4, mood) WHERE user_id=$5 and report_for=$6;", report.sportsHours, report.studyHours, report.eatingQuality, report.mood, userId, report.reportFor);
        return true;
    } catch (e) {
        return false;
    }

    return report;
};

const updateMorningReport = async (report, userId) => {
    try {
        await executeQuery("UPDATE reportings_morning set sleep_hours=coalesce($1, sleep_hours), sleep_quality=coalesce($2, sleep_quality), mood=coalesce($3, mood) WHERE user_id=$4 and report_for=$5;", report.sleepHours, report.sleepQuality, report.mood, userId, report.reportFor);
        return true;
    } catch (e) {
        return false;
    }

    return report;
};

const getAverageLast = async (userId, period='w') => {
    try {
        let timePeriod = period;
        if (period === 'w') {
            timePeriod = '7 days';
        } else if (period === 'm') {
            timePeriod = '30 days';
        } else if (period === 'y') {
            timePeriod = '365 days';
        } else {
            timePeriod = '7 days';
        }

        const res = await executeQuery(`with base_data as (select rm.user_id, coalesce(rm.report_for, re.report_for) as report_for, sports_hours, study_hours, eating_quality , rm.mood as morn_mood, sleep_hours, sleep_quality, re.mood as eve_mood from reportings_evening re full outer join reportings_morning rm on re.report_for  = rm.report_for where re.user_id = $1 or rm.user_id = $1) select round(avg(sports_hours)::decimal, 2) as avg_sports, round(avg(study_hours)::decimal, 2) as avg_study, round(avg(sleep_hours)::decimal, 2) as avg_sleep, round(avg(sleep_quality)::decimal, 2) as avg_sleep_quality, round(avg(eating_quality)::decimal, 2) as avg_eating, case	when count(morn_mood) + count(eve_mood) = 0 then 0 else round((sum(morn_mood) + sum(eve_mood))::decimal / (count(morn_mood) + count(eve_mood))::decimal, 2) end as avg_mood from base_data where report_for between now() - interval '${timePeriod}' and now();`, userId); //, timePeriod);

        return res.rowsOfObjects()[0];
    } catch (e) {
        return false;
    }
};

const getSummaryForGivenWeek = async (userId, weekNo, year) => {
    try {
        const res = await executeQuery(`with base_data as (select rm.user_id, coalesce(rm.report_for, re.report_for) as report_for, sports_hours, study_hours, eating_quality , rm.mood as morn_mood, sleep_hours, sleep_quality, re.mood as eve_mood from reportings_evening re full outer join reportings_morning rm on re.report_for  = rm.report_for where re.user_id = $1 or rm.user_id = $1) select round(avg(sports_hours)::decimal, 2) as avg_sports, round(avg(study_hours)::decimal, 2) as avg_study, round(avg(sleep_hours)::decimal, 2) as avg_sleep, round(avg(sleep_quality)::decimal, 2) as avg_sleep_quality, round(avg(eating_quality)::decimal, 2) as avg_eating, case	when count(morn_mood) + count(eve_mood) = 0 then 0 else round((sum(morn_mood) + sum(eve_mood))::decimal / (count(morn_mood) + count(eve_mood))::decimal, 2) end as avg_mood from base_data where extract(week from report_for) = $2 and extract(year from report_for) = $3;`, userId, weekNo, year); //, timePeriod);
        return res.rowsOfObjects()[0];
    } catch (e) {
        return false;
    }
};


const getSummaryForGivenMonth = async (userId, monthNo, year) => {
    try {
        const res = await executeQuery(`with base_data as (select rm.user_id, coalesce(rm.report_for, re.report_for) as report_for, sports_hours, study_hours, eating_quality , rm.mood as morn_mood, sleep_hours, sleep_quality, re.mood as eve_mood from reportings_evening re full outer join reportings_morning rm on re.report_for  = rm.report_for where re.user_id = $1 or rm.user_id = $1) select round(avg(sports_hours)::decimal, 2) as avg_sports, round(avg(study_hours)::decimal, 2) as avg_study, round(avg(sleep_hours)::decimal, 2) as avg_sleep, round(avg(sleep_quality)::decimal, 2) as avg_sleep_quality, round(avg(eating_quality)::decimal, 2) as avg_eating, case	when count(morn_mood) + count(eve_mood) = 0 then 0 else round((sum(morn_mood) + sum(eve_mood))::decimal / (count(morn_mood) + count(eve_mood))::decimal, 2) end as avg_mood from base_data where extract(month from report_for) = $2 and extract(year from report_for) = $3;`, userId, monthNo, year); //, timePeriod);
        return res.rowsOfObjects()[0];
    } catch (e) {
        return false;
    }
};

const getSummaryForDay = async (userId, date) => {
    try {
        const res = await executeQuery(`with base_data as (
select rm.user_id, coalesce(rm.report_for, re.report_for) as report_for, sports_hours, study_hours, eating_quality , rm.mood as morn_mood,
sleep_hours, sleep_quality, re.mood as eve_mood 
from reportings_evening re full outer join reportings_morning rm on re.report_for  = rm.report_for 
where re.user_id = $1 or rm.user_id = $1
) select *, round((morn_mood + eve_mood)::decimal / 2, 2) as avg_mood
from base_data where report_for=$2;`, userId, date);

        return res.rowsOfObjects()[0];
    } catch (e) {
        return false;
    }
};

const getMoodTrend = async (userId, period='t') => {
    try {
        let timePeriod;
        if (period === 't') {
            timePeriod = '';
        } else if (period === 'y') {
            timePeriod = "- interval '1 day'";
        } else {
            timePeriod = '';
        }

        const res = await executeQuery(`with base_data as (
select rm.user_id, coalesce(rm.report_for, re.report_for) as report_for, sports_hours, study_hours, eating_quality , rm.mood as morn_mood,
sleep_hours, sleep_quality, re.mood as eve_mood 
from reportings_evening re full outer join reportings_morning rm on re.report_for  = rm.report_for 
where re.user_id = $1 or rm.user_id = $1
) select report_for, round((coalesce(morn_mood, 0) + coalesce(eve_mood, 2))::decimal / 2, 2) as avg_mood
from base_data where report_for = current_date ${timePeriod};`, userId);

        return res.rowsOfObjects();
    } catch (e) {
        return false;
    }
};

const getTodayReportCount = async () => {
    try {
        const res = await executeQuery("select (select count(*) from reportings_morning rm where report_for = current_date) as count_morn, (select count(*) from reportings_evening re where report_for = current_date) as count_eve;");
        return res.rowsOfObjects()[0];
    } catch (e) {
        return false;
    }
};


export { addMorningReport,
    addEveningReport,
    updateEveningReport,
    updateMorningReport,
    getAverageLast,
    getSummaryForDay,
    getMoodTrend,
    getTodayReportCount,
    getSummaryForGivenMonth,
    getSummaryForGivenWeek,
};
