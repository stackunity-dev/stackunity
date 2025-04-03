Probleme : le seo-audit na analyse que une page
On va simplifier ca avec des API et le rendre + complet (toute page...)
// API 1 

Le snippet de rapid api : 

const http = require('https');

const options = {
	method: 'POST',
	hostname: 'seo-master-scan-website-analysis-performance-reporting.p.rapidapi.com',
	port: null,
	path: '/analyze?noqueue=1',
	headers: {
		'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776',
		'x-rapidapi-host': 'seo-master-scan-website-analysis-performance-reporting.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.write(JSON.stringify({
  url: 'https://example.com',
  sections: [
    'performanceMetrics'
  ]
}));
req.end();

la reponse : 

Text
JSON
Raw
Copy
Collapse All
content:performanceMetrics:
firstContentfulPaint:"207ms"
largestContentfulPaint:"207ms"
firstMeaningfulPaint:"N/A"
speedIndex:"207ms"
timeToInteractive:"207ms"
totalBlockingTime:"0ms"
cumulativeLayoutShift:"0"
domSize:5
serverResponseTime:"126ms"
bootupTime:"0ms"
mainThreadWork:"31ms"
resourceSize:"949B"
performanceScore:"100%"
firstContentfulPaintScore:"100%"
speedIndexScore:"100%"
largestContentfulPaintScore:"100%"
interactiveScore:"100%"
totalBlockingTimeScore:"100%"
cumulativeLayoutShiftScore:"100%"
cacheTime:1742749817064
url:"https://example.com"
settings:sections:
0:"performanceMetrics"
time:1743717320925
status:"success"
message:"Data retrieve

// API 2 

snipept : 

const http = require('https');

const options = {
	method: 'GET',
	hostname: 'website-analyze-and-seo-audit-pro.p.rapidapi.com',
	port: null,
	path: '/onpage.php?website=codeconia.com',
	headers: {
		'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776',
		'x-rapidapi-host': 'website-analyze-and-seo-audit-pro.p.rapidapi.com'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.end(); 

le resultat : basic:
websiteurl:"codeconia.com"
title:"Codeconia -Learn Programming"
favicon:"http://www.google.com/s2/favicons?domain=codeconia.com"
webtitle:
title:"Codeconia -Learn Programming"
length:28
metadescription:
description:"Programmer Guide"
length:16
metakeywords:
keywords:null
counts:2
headings:h1:headings:
0:" Web Development Tutorials & Codes "
count:1
h2:headings:
count:0
h3:headings:
count:0
h4:headings:
count:0
h5:headings:
0:"Google Auth in android and ios with React native Expo Managed workflow"
1:"Web Hosting Server: When and Why It’s the Right Choice"
2:"Web Hosting for Small Businesses: A Mid-Range Solution for Growing Businesses"
3:"Reseller Hosting: Benefits and Considerations"
4:"Drag and Drop with Swapy and PHP"
5:"How To Generate A PDF from HTML in Laravel 11"
6:"How to get the next value of an array and loop it in the array in PHP"
7:"New Open Source CRM for project Management and Invoicing"
8:"Post View Counts WordPress plugin (Documentation)"
9:"How to create Laravel Flash Messages"
10:"How to make Custom Artisan Command in Laravel"
11:"Tips for Laravel migrations"
12:"Tricks and tips for Laravel blade templating"
13:"How To display JSON data in a Laravel blade template"
14:"HTML to PDF Conversion easiest way using JavaScript"
15:"How to create a Girlfriend by using AI and javascript"
16:"Send message to a Telegram channel using PHP"
17:"How to create Instagram Bot with InstaPy"
18:"PHP Contact form send email – Website integration ✔️"
19:"How to Host Laravel project in cPanel easiest way ✔️"
20:"HTML Form to Email Using JavaScript and SMTP server 🚀"
21:"HTML to PDF Conversion easiest way using JavaScript"
22:"How to create a photo gallery in php without a database"
23:"PHP Contact form send email – Website integration ✔️"
24:"Digital Marketing Toolkit"
count:25
h6:headings:
count:0
sitemap_robots:
0:"robots.txt"
1:"sitemap.xml"
iframe:
count:0
underscoreurl:null
urlrewrite:null
images:data:
0:"https://codeconia.com/wp-content/themes/codeconia/images/blackpng.png"
1:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
2:"https://codeconia.com/wp-content/uploads/2024/10/https___dev-to-uploads.s3.amazonaws.com_uploads_articles_fhfhj2t2bbjtzg6s9ccc.avif"
3:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
4:"https://codeconia.com/wp-content/uploads/2024/09/Web-Hosting-Server_-When-and-Why-Its-the-Right-Choice-300x167.png"
5:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
6:"https://codeconia.com/wp-content/uploads/2024/09/Web-Hosting-for-Small-Businesses_-A-Mid-Range-Solution-for-Growing-Businesses-300x167.png"
7:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
8:"https://codeconia.com/wp-content/uploads/2024/09/Reseller-Hosting_-Benefits-and-Considerations-300x167.png"
9:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
10:"https://codeconia.com/wp-content/uploads/2024/09/Marielle-Price-1-300x169.jpg"
11:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
12:"https://codeconia.com/wp-content/uploads/2024/06/Marielle-Price-300x169.jpg"
13:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
14:"https://codeconia.com/wp-content/uploads/2023/07/Marielle-Price-300x169.png"
15:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
16:"https://codeconia.com/wp-content/uploads/2022/12/preview-xl-1-300x150.jpg"
17:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
18:"https://codeconia.com/wp-content/uploads/2022/12/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-5-300x169.jpg"
19:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
20:"https://codeconia.com/wp-content/uploads/2022/12/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-4-300x169.jpg"
21:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
22:"https://codeconia.com/wp-content/uploads/2022/12/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-3-300x169.jpg"
23:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
24:"https://codeconia.com/wp-content/uploads/2022/12/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-2-300x169.jpg"
25:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
26:"https://codeconia.com/wp-content/uploads/2022/12/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-1-300x169.jpg"
27:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
28:"https://codeconia.com/wp-content/uploads/2022/12/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-300x169.jpg"
29:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
30:"https://codeconia.com/wp-content/uploads/2021/09/Marielle-Price-300x169.png"
31:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
32:"https://codeconia.com/wp-content/uploads/2021/07/Copy-of-HTML-CONTACT-FORM-TO-EMAIL-300x169.png"
33:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
34:"https://codeconia.com/wp-content/uploads/2021/05/Most-popular-Telegram-bots-300x187.jpg"
35:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
36:"https://codeconia.com/wp-content/uploads/2021/03/maxresdefault-1-300x169.jpg"
37:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
38:"https://codeconia.com/wp-content/uploads/2021/01/HTML-CONTACT-FORM-TO-EMAIL-300x169.gif"
39:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
40:"https://codeconia.com/wp-content/uploads/2020/11/upload-laravel-to-shared-hosting-300x118.jpg"
41:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
42:"https://codeconia.com/wp-content/uploads/2021/09/Javascript-300x169.gif"
43:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
44:"https://codeconia.com/wp-content/uploads/2021/09/Marielle-Price-300x169.png"
45:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
46:"https://codeconia.com/wp-content/uploads/2021/06/wordpress-photo-gallery-plugins1-300x150.png"
47:"//codeconia.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"
48:"https://codeconia.com/wp-content/uploads/2021/01/HTML-CONTACT-FORM-TO-EMAIL-300x169.gif"
49:"https://www.awltovhc.com/image-100477035-15022370"
50:"https://codeconia.com/wp-content/themes/codeconia/images/digitalprokit.jpg"
51:"https://www.awltovhc.com/image-100477035-14347998"
count:52
links:data:0:
link:"/"
title:" "
1:
link:"/"
title:"Home"
2:
link:"/latest-posts"
title:"Latest 🚀"
3:
link:"/category/php/"
title:"PHP"
4:
link:"/category/javascript/"
title:"Javascript"
5:
link:"/category/updates/"
title:"Updates/Reviews 🌟"
6:
link:"https://store.codeconia.com/"
title:"Scripts"
7:
link:"https://www.youtube.com/channel/UC_klOvl59ySlBnXH4tKr5Og"
title:"Youtube"
8:
link:"/community"
title:"Forum 🥂"
9:
link:"https://www.youtube.com/channel/UC_klOvl59ySlBnXH4tKr5Og"
title:" "
10:
link:"https://twitter.com/ajith_jojo"
title:" "
11:
link:"https://github.com/ajithjojo"
title:" "
12:
link:"https://codeconia.com/google-auth-in-android-and-ios-with-react-native-expo-managed-workflow/"
title:" "
13:
link:"https://codeconia.com/google-auth-in-android-and-ios-with-react-native-expo-managed-workflow/"
title:" Google Auth in android and ios with React native Expo Managed workflow"
14:
link:"https://codeconia.com/web-hosting-server-when-and-why-its-the-right-choice/"
title:" "
15:
link:"https://codeconia.com/web-hosting-server-when-and-why-its-the-right-choice/"
title:" Web Hosting Server: When and Why It’s the Right Choice"
16:
link:"https://codeconia.com/web-hosting-for-small-businesses-a-mid-range-solution-for-growing-businesses/"
title:" "
17:
link:"https://codeconia.com/web-hosting-for-small-businesses-a-mid-range-solution-for-growing-businesses/"
title:" Web Hosting for Small Businesses: A Mid-Range Solution for Growing Businesses"
18:
link:"https://codeconia.com/reseller-hosting-benefits-and-considerations/"
title:" "
19:
link:"https://codeconia.com/reseller-hosting-benefits-and-considerations/"
title:" Reseller Hosting: Benefits and Considerations"
20:
link:"https://codeconia.com/drag-and-drop-with-swapy-and-php/"
title:" "
21:
link:"https://codeconia.com/drag-and-drop-with-swapy-and-php/"
title:" Drag and Drop with Swapy and PHP"
22:
link:"https://codeconia.com/how-to-generate-a-pdf-from-html-in-laravel-11/"
title:" "
23:
link:"https://codeconia.com/how-to-generate-a-pdf-from-html-in-laravel-11/"
title:" How To Generate A PDF from HTML in Laravel 11"
24:
link:"https://codeconia.com/how-to-get-the-next-value-of-an-array-and-loop-it-in-the-array-in-php/"
title:" "
25:
link:"https://codeconia.com/how-to-get-the-next-value-of-an-array-and-loop-it-in-the-array-in-php/"
title:" How to get the next value of an array and loop it in the array in PHP"
26:
link:"https://codeconia.com/new-open-source-crm-for-project-management-and-invoicing/"
title:" "
27:
link:"https://codeconia.com/new-open-source-crm-for-project-management-and-invoicing/"
title:" New Open Source CRM for project Management and Invoicing"
28:
link:"https://codeconia.com/post-view-counts-wordpress-plugin-documentation/"
title:" "
29:
link:"https://codeconia.com/post-view-counts-wordpress-plugin-documentation/"
title:" Post View Counts WordPress plugin (Documentation)"
30:
link:"https://codeconia.com/how-to-create-laravel-flash-messages/"
title:" "
31:
link:"https://codeconia.com/how-to-create-laravel-flash-messages/"
title:" How to create Laravel Flash Messages"
32:
link:"https://codeconia.com/how-to-make-custom-artisan-command-in-laravel/"
title:" "
33:
link:"https://codeconia.com/how-to-make-custom-artisan-command-in-laravel/"
title:" How to make Custom Artisan Command in Laravel"
34:
link:"https://codeconia.com/tips-for-laravel-migrations/"
title:" "
35:
link:"https://codeconia.com/tips-for-laravel-migrations/"
title:" Tips for Laravel migrations"
36:
link:"https://codeconia.com/tricks-and-tips-for-laravel-blade-templating/"
title:" "
37:
link:"https://codeconia.com/tricks-and-tips-for-laravel-blade-templating/"
title:" Tricks and tips for Laravel blade templating"
38:
link:"https://codeconia.com/how-to-display-json-data-in-a-laravel-blade-template/"
title:" "
39:
link:"https://codeconia.com/how-to-display-json-data-in-a-laravel-blade-template/"
title:" How To display JSON data in a Laravel blade template"
40:
link:"https://codeconia.com/html-to-pdf-convertor-easiest-way-using-javascript/"
title:" "
41:
link:"https://codeconia.com/html-to-pdf-convertor-easiest-way-using-javascript/"
title:" "
42:
link:"https://codeconia.com/html-to-pdf-convertor-easiest-way-using-javascript/"
title:" HTML to PDF Conversion easiest way using JavaScript"
43:
link:"https://codeconia.com/how-to-create-a-girlfriend-by-using-ai-and-javascript/"
title:" "
44:
link:"https://codeconia.com/how-to-create-a-girlfriend-by-using-ai-and-javascript/"
title:" "
45:
link:"https://codeconia.com/how-to-create-a-girlfriend-by-using-ai-and-javascript/"
title:" How to create a Girlfriend by using AI and javascript"
46:
link:"https://codeconia.com/send-message-to-a-telegram-channel-using-php/"
title:" "
47:
link:"https://codeconia.com/send-message-to-a-telegram-channel-using-php/"
title:" "
48:
link:"https://codeconia.com/send-message-to-a-telegram-channel-using-php/"
title:" Send message to a Telegram channel using PHP"
49:
link:"https://codeconia.com/how-to-create-instagram-bot-with-instapy/"
title:" "
50:
link:"https://codeconia.com/how-to-create-instagram-bot-with-instapy/"
title:" "
51:
link:"https://codeconia.com/how-to-create-instagram-bot-with-instapy/"
title:" How to create Instagram Bot with InstaPy"
52:
link:"https://codeconia.com/contact-form-with-phpmail-for-your-website/"
title:" "
53:
link:"https://codeconia.com/contact-form-with-phpmail-for-your-website/"
title:" "
54:
link:"https://codeconia.com/contact-form-with-phpmail-for-your-website/"
title:" PHP Contact form send email – Website integration ✔️"
55:
link:"https://codeconia.com/host-laravel-8-project-on-cpanel-easiest-way/"
title:" "
56:
link:"https://codeconia.com/host-laravel-8-project-on-cpanel-easiest-way/"
title:" "
57:
link:"https://codeconia.com/host-laravel-8-project-on-cpanel-easiest-way/"
title:" How to Host Laravel project in cPanel easiest way ✔️"
58:
link:"https://codeconia.com/html-form-to-email-using-javascript-and-smtp-server/"
title:" "
59:
link:"https://codeconia.com/html-form-to-email-using-javascript-and-smtp-server/"
title:" HTML Form to Email Using JavaScript and SMTP server 🚀"
60:
link:"https://codeconia.com/html-to-pdf-convertor-easiest-way-using-javascript/"
title:" "
61:
link:"https://codeconia.com/html-to-pdf-convertor-easiest-way-using-javascript/"
title:" HTML to PDF Conversion easiest way using JavaScript"
62:
link:"https://codeconia.com/how-to-create-a-gallery-without-a-database-using-php/"
title:" "
63:
link:"https://codeconia.com/how-to-create-a-gallery-without-a-database-using-php/"
title:" How to create a photo gallery in php without a database"
64:
link:"https://codeconia.com/contact-form-with-phpmail-for-your-website/"
title:" "
65:
link:"https://codeconia.com/contact-form-with-phpmail-for-your-website/"
title:" PHP Contact form send email – Website integration ✔️"
66:
link:"https://codeconia.com/category/php/"
title:"PHP"
67:
link:"https://codeconia.com/category/php/laravel/"
title:"Laravel"
68:
link:"https://codeconia.com/category/javascript/"
title:"Javascript"
69:
link:"https://codeconia.com/category/javascript/react/"
title:"React"
70:
link:"https://codeconia.com/category/python/"
title:"Python"
71:
link:"https://codeconia.com/category/arduino/"
title:"Arduino"
72:
link:"https://codeconia.com/category/tips/"
title:"Tips"
73:
link:"https://codeconia.com/category/web-design/"
title:"Web Design"
74:
link:"https://codeconia.com/category/updates/"
title:"Updates"
75:
link:"https://codeconia.com/category/tech-updates/"
title:"Tech Updates"
76:
link:"https://codeconia.com/guest-posting-codeconia/"
title:"Guest Posting 🥂"
77:
link:"https://www.tkqlhce.com/click-100477035-15022370"
title:" "
78:
link:"http://digitalprokit.com/"
title:" "
79:
link:"http://digitalprokit.com/"
title:"Get Free Access Now"
80:
link:"https://www.anrdoezrs.net/click-100477035-14347998"
title:" "
81:
link:"#!"
title:""
82:
link:"#!"
title:""
83:
link:"#!"
title:""
84:
link:"#!"
title:""
85:
link:"#!"
title:""
86:
link:"#!"
title:""
87:
link:"https://codeconia.com/"
title:"codeconia.com"
88:
link:"https://www.dpbolvw.net/click-100477035-12454592"
title:"Contabo "
count:89

Donc integre ces 2 api allege le code met a jour seo.vue en fonction et maintient un max de fonctionnaliter

CHAQUE PAGE DOIT ETRE ANALYSER ET NE PAS OUBLIER LA GENERATION DU SITEMAP