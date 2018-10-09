module.exports.arrayList = {


menu_string_eng :['TOP-STORIES','TRANDING-STORIES','RECENT','INDIA-NEWS','ENTERTAINMENT','CRICKET','PHOTO-GALLERY','VIDEO','JOBS','kavya','e_paper'],
menu_string : ["टॉप ख़बरें","ट्रैंडिंग-खबरें","ताज़ा-खबरें","देश","मनोरंजन","क्रिकेट","फोटो","वीडियो","जॉब्स",'काव्य','इ-पेपर'],


user_subscribed_category:['subscribed_TOP-STORIES','subscribed_TRANDING-STORIES','subscribed_RECENT','subscribed_INDIA-NEWS','subscribed_ENTERTAINMENT','subscribed_CRICKET','subscribed_PHOTO-GALLERY','subscribed_VIDEO','subscribed_JOBS'],
user_unsubscribed:['unsubs_TOP-STORIES','unsubs_TRANDING-STORIES','unsubs_RECENT','unsubs_INDIA-NEWS','unsubs_ENTERTAINMENT','unsubs_CRICKET','unsubs_PHOTO-GALLERY','unsubs_VIDEO','unsubs_JOBS'],

subscribe_categories : ['TOP-STORIES_subscribe','TRANDING-STORIES_subscribe','RECENT_subscribe','INDIA-NEWS_subscribe','ENTERTAINMENT_subscribe','CRICKET_subscribe','PHOTO-GALLERY_subscribe','VIDEO_subscribe','JOBS_subscribe'],


hey_string : ["hello","hi","hy","hey"],

no_string: ['no','nope','nopes','neah'],


choose_time_array : ['6AM','7AM','8PM','6AM & 8AM','6AM & 8PM','8PM & 10PM','6AM & 8AM & 7PM','6AM & 12PM & 8PM','7PM & 8PM & 9PM'],


times_a_day_hin:['दिन में एक बार','दिन में दो बार','दिन में तीन बार'],
times_a_day_eng : ['onceAday','twiceAday','thriceAday'],
//below three are stored as it is in the database
onceAday:['6AM','7AM','8PM'],
twiceAday:['6AM & 8AM','6AM & 8PM','8PM & 10PM'],
thriceAday:['6AM & 8AM & 7PM','6AM & 12PM & 8PM','7PM & 8PM & 9PM'],
//the time data which will be inserted into data 
'6AM':['6'],
'7AM':['7'],
'8AM':['8'],
'6AM & 8AM':['6','8'],
'6AM & 8PM':['6','20'],
'8PM & 10PM':['8','22'],
'6AM & 8AM & 7PM':['6','8','19'],
'6AM & 12PM & 8PM':['6','12','20'],
'7PM & 8PM & 9PM':['19','20','21'],
};

module.exports.menu_string={
	main_menu_string:[{
	title_hn :"टॉप ख़बरें",
    title:"Top News",
	payload:'TOP-STORIES',
	image_url:'testbot.amarujala.com/images/Top_news.png',
	},
	{
	title_hn :"ट्रैंडिंग-खबरें",
        title:"Trending News",
	payload:'TRANDING-STORIES',
	image_url:'testbot.amarujala.com/images/trending.png',
	},
	{
	title_hn :"ताज़ा-खबरें",
        title:"recent News",
	payload:"RECENT",
	image_url:'testbot.amarujala.com/images/Tazakhabar.png',
	},
	{
	title_hn :"देश",
        title:"india News",
	payload:'INDIA-NEWS',
	image_url:'testbot.amarujala.com/images/desh.png',
	},
	{
	title_hn :'मनोरंजन',
	payload:'ENTERTAINMENT',
        title:"Top News",
	image_url:'testbot.amarujala.com/images/entertainment.png',
	},
	{
	title_hn :'क्रिकेट',
        title:"cricket News",
	payload:'CRICKET',
	image_url:'testbot.amarujala.com/images/cricket.png',
	},
	{
	title_hn :'फोटो',
        title:"photo",
	payload:'PHOTO-GALLERY',
	image_url:'testbot.amarujala.com/images/Photos.png',
	},
	{
	title_hn :'वीडियो',
        title:"video",
	payload:'VIDEO',
	image_url:'testbot.amarujala.com/images/video.png',
	},
	{
	title_hn :'जॉब्स',
        title:"job",
	payload:'JOBS',
	image_url:'testbot.amarujala.com/images/jobs.png',
	},
	{
	title_hn :'काव्य',
        title:"kavya",
	payload:'kavya',
	image_url:'testbot.amarujala.com/images/kavya.png',
	},
	{
	title_hn :'इ-पेपर',
        title:"e_paper",
	payload:'e_paper',
	image_url:'testbot.amarujala.com/images/Epaper.png',
	}]
}
