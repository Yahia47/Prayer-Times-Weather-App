document.addEventListener('DOMContentLoaded', async () => {

    // const countries = {
    //     "السعودية": ["الرياض", "جدة", "مكة المكرمة", "الدمام", "المدينة المنورة", "الطائف", "الخبر"],
    //     "مصر": ["القاهرة", "الإسكندرية", "الجونة", "شرم الشيخ", "الأقصر", "أسوان", "بورسعيد"],
    //     "الإمارات": ["دبي", "أبوظبي", "العين", "الشارقة", "رأس الخيمة", "عجمان", "الفجيرة"],
    //     "قطر": ["الدوحة", "الوكرة", "الخور", "الريان", "مسيعيد"],
    //     "الأردن": ["عمان", "إربد", "الزرقاء", "العقبة", "جرش", "مادبا"],
    //     "الكويت": ["مدينة الكويت", "الأحمدي", "الجهراء", "الفروانية", "حولي"],
    //     "المغرب": ["الرباط", "الدار البيضاء", "مراكش", "فاس", "طنجة", "أكادير"],
    //     "الجزائر": ["الجزائر", "وهران", "قسنطينة", "عنابة", "البليدة", "سطيف"],
    //     "تونس": ["تونس", "سوسة", "صفاقس", "قابس", "المنستير"],
    //     "لبنان": ["بيروت", "طرابلس", "صيدا", "زحلة", "جونية"],
    //     "العراق": ["بغداد", "البصرة", "الموصل", "أربيل", "النجف", "كربلاء"],
    //     "سوريا": ["دمشق", "حلب", "حمص", "اللاذقية", "طرطوس"],
    //     "ليبيا": ["طرابلس", "بنغازي", "مصراتة", "البيضاء", "سبها"],
    //     "البحرين": ["المنامة", "المحرق", "الرفاع", "مدينة عيسى"],
    //     "عُمان": ["مسقط", "صلالة", "نزوى", "صحار", "الرستاق"],
    //     "اليمن": ["صنعاء", "عدن", "تعز", "الحديدة", "المكلا"]
    // };


    const countrySelect = document.getElementById('country-select');
    const citySelect = document.getElementById('city-select');
    let countriesDetails = []

        // Fetch Countries
    const getCountries = async () => {
        try {
            const response = await axios.get('https://countriesnow.space/api/v0.1/countries')
            const countries = response.data.data.map((country) => country.country) || [];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.append(option);
            })
            return response.data.data
        } catch (error) {
            console.error("Error fetching cities:", error);
            alert("حدث خطأ أثناء جلب المدن. يرجى المحاولة مرة أخرى.");
        }
    }

    countriesDetails = await getCountries()
         // Fetch Cities for Selected Country
    countrySelect.addEventListener('change', () => {
        const country = countrySelect.value;
        const cities = countriesDetails.find((countryObj) => countryObj.country === country)?.cities || [];
        citySelect.innerHTML = '<option value="">اختر مدينة</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    })




    //Prayer Time :
// عند تغيير المدينة، نقوم بجلب مواقيت الصلاة
citySelect.addEventListener('change', async () => {
    const country = countrySelect.value;
    const city = citySelect.value;

    // تحديث اسم المدينة في الصفحة
    const cityNameElement = document.getElementById('city-name')
    cityNameElement.innerHTML = city;
    // تحديث اسم البلد في الصفحة
    const countryNameElement = document.getElementById('country-name');
    countryNameElement.innerHTML = `<i class="fa-solid fa-location-dot"></i>  ${country}`;

    if (country && city) {
        try {
            const params = {
                country: country,
                city: city
            };
            const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', { params });
            const timings = response.data.data.timings;
            console.log(timings)
            document.getElementById('fajr-time').innerHTML = timings.Fajr || "غير متوفر";
            document.getElementById('sunrise-time').innerHTML = timings.Sunrise || "غير متوفر";
            document.getElementById('dhurh-time').innerHTML = timings.Dhuhr || "غير متوفر";
            document.getElementById('asr-time').innerHTML = timings.Asr || "غير متوفر";
            document.getElementById('sunset-time').innerHTML = timings.Maghrib || "غير متوفر";
            document.getElementById('isha-time').innerHTML = timings.Isha || "غير متوفر";
            document.getElementById('midnight-time').innerHTML = timings.Firstthird || "غير متوفر";

            //Miladi
            const dategregorian = response.data.data.date.gregorian.date;
            const dategregorianDay = response.data.data.date.gregorian.weekday.en;
            const dategregorianDayNum = response.data.data.date.gregorian.day;
            const dategregorianMonth = response.data.data.date.gregorian.month.en;
            const dategregorianYear = response.data.data.date.gregorian.year;

            const DateTodayMiladi = `${dategregorianDay} ${dategregorianDayNum} ${dategregorianMonth} ${dategregorianYear}`;

            //Hijri
            const dateHijri = response.data.data.date.hijri.date;
            const dateHijrinDay = response.data.data.date.hijri.weekday.ar;
            const dateHijriDayNum = response.data.data.date.hijri.day;
            const dateHijriMonth = response.data.data.date.hijri.month.ar;
            const dateHijriYear = response.data.data.date.hijri.year;

            const DateTodayHijri = `${dateHijriYear} ${dateHijrinDay} ${dateHijriDayNum} ${dateHijriMonth}`;

            // عرض التاريخ الميلادي والهجري
            document.getElementById('date').innerHTML = DateTodayMiladi;
            document.getElementById('datehijri').innerHTML = DateTodayHijri;




                    // Fetch Weather Data using Geolocation API (You need to add your own method for latitude and longitude)
                    const geocodeResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=4336f52b82e9946cbf1f02e3a394ba57`);
                      console.log(geocodeResponse)
                    const { lat, lon } = geocodeResponse.data[0];
    
                    // Fetch Weather
                    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
                        params: {
                            latitude: lat,
                            longitude: lon,
                            current_weather: true,
                        },
                    });
                    console.log(weatherResponse)
                    // Weather
                    const weather = weatherResponse.data.current_weather;
                    document.getElementById('temperature').innerHTML = `درجة الحرارة: ${weather.temperature} °C`;
                    document.getElementById('weather-description').innerHTML = `الوصف: ${weather.weathercode}`;
                    const weatherIcons = {
                        0: "fa-sun",       // Clear sky
                        1: "fa-cloud-sun", // Mainly clear
                        2: "fa-cloud",     // Partly cloudy
                        3: "fa-cloud",     // Overcast
                        45: "fa-smog",     // Fog
                        48: "fa-smog",     // Depositing rime fog
                        51: "fa-cloud-rain", // Drizzle: Light
                        53: "fa-cloud-rain", // Drizzle: Moderate
                        55: "fa-cloud-showers-heavy", // Drizzle: Dense intensity
                        61: "fa-cloud-showers-heavy", // Rain: Slight
                        63: "fa-cloud-showers-heavy", // Rain: Moderate
                        65: "fa-cloud-showers-heavy", // Rain: Heavy intensity
                        71: "fa-snowflake",  // Snow fall: Slight
                        73: "fa-snowflake",  // Snow fall: Moderate
                        75: "fa-snowflake",  // Snow fall: Heavy intensity
                        95: "fa-bolt",      // Thunderstorm: Slight or moderate
                        96: "fa-bolt",      // Thunderstorm with hail
                        99: "fa-cloud-bolt" // Thunderstorm with heavy hail
                    };
                    
                    console.log(weather.weathercode);  // تحقق من القيم
                    const iconClass = weatherIcons[weather.weathercode] || "fa-cloud"; // افتراض أيقونة للسحب إن لم يوجد كود معروف
    
                    const weatherDescription = weather.weathercode || weather.weather.main;
                    //const iconClass = weatherIcons[weatherDescription] || "fa-cloud"; // افتراض أيقونة للسحب إن لم يوجد كود معروف
                    document.getElementById('weather-icon').innerHTML = `<i class="fa ${iconClass}"></i>`;
                    // Weather
                    // console.log(weather.main);
    

        } catch (error) {
            console.error("Error fetching prayer times:", error);
           // alert("حدث خطأ أثناء جلب مواقيت الصلاة. يرجى المحاولة مرة أخرى.");
        }
    }
});
})
        //     const readableDate = response.data.data.date.readable;
        //     const hijriData = response.data.data.hijri;
        //     const DayHijri = hijriData.weekday.ar ;
        //     const MonthHijri = hijriData.month.ar ;
        //     const YearHijri = hijriData.year ;
        // console.log(DayHijri)
        // console.log(MnthHijri)
        // console.log(YearHijri)
        //     document.getElementById('date').innerHTML = ${readableDate} (${DayHijri} ${MonthHijri} ${YearHijri});
      



    // getPrayersTimingsofCity("وهران");











































































    
       