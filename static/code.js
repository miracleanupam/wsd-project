const getWeekData = async () => {
    console.log('static code ko first line');
    const response = await fetch('/report-week/49');
    console.log(response);
};
