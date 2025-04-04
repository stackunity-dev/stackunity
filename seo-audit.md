REMPLACER L'API de base qui recupere les donnee globales 

snippet Target:
Node.js
Client:
HTTP

const http = require('https');

const options = {
	method: 'GET',
	hostname: 'website-seo-analyzer.p.rapidapi.com',
	port: null,
	path: '/seo/seo-audit-basic?url=https%3A%2F%2Flearnwithhasan.com',
	headers: {
		'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776',
		'x-rapidapi-host': 'website-seo-analyzer.p.rapidapi.com'
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

 resultat possible 

 success:true
message:"Report Generated Successfully"
result:Input:
URL:"https://learnwithhasan.com"
Input type:"Domain"
http:
status:200
using_https:true
contentSize:
bytes:132263
kb:129.16
headers:
Date:"Fri, 04 Apr 2025 05:01:52 GMT"
Content-Type:"text/html; charset=UTF-8"
Transfer-Encoding:"chunked"
Connection:"keep-alive"
CF-Ray:"92ae40112f9a30e3-SEA"
CF-Cache-Status:"HIT"
Age:"35990"
Cache-Control:"max-age=14400"
Last-Modified:"Thu, 03 Apr 2025 17:58:57 GMT"
Link:"<https://learnwithhasan.com/wp-json/>; rel="https://api.w.org/", <https://learnwithhasan.com/wp-json/wp/v2/pages/68099>; rel="alternate"; title="JSON"; type="application/json", <https://learnwithhasan.com/>; rel=shortlink"
Vary:"Accept-Encoding"
cf-apo-via:"tcache"
cf-edge-cache:"cache,platform=wordpress"
x-powered-by:"PHP/8.3.19, PleskLin"
Report-To:"{"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=NlWWRgA81bsakmmjpJIk31e22193EjvCP7%2FxM9WtEt%2FnePIDxyAcAjj00IVmNuChTbSOmqBbKDfOjoVSISjZ4nfl2TAYe7kGWp51qm%2Bf7C85N7Wd96GCjcxOPlrbxx%2BgRkcIaw%3D%3D"}],"group":"cf-nel","max_age":604800}"
NEL:"{"success_fraction":0,"report_to":"cf-nel","max_age":604800}"
Server:"cloudflare"
Content-Encoding:"gzip"
server-timing:"cfL4;desc="?proto=TCP&rtt=1539&min_rtt=1441&rtt_var=478&sent=4&recv=7&lost=0&retrans=0&sent_bytes=2859&recv_bytes=757&delivery_rate=1769089&cwnd=251&unsent_bytes=0&cid=036d39b0975b1a49&ts=34&x=0""
redirections:false
responseTime:"0.091713 seconds"
title:
found:"Found"
data:"Become a Successful Digital Entrepreneur - LearnWithHasan"
length:57
characters:57
words:7
charPerWord:8.14
tag number:1
meta_description:
found:"Found"
data:"Master digital entrepreneurship with proven strategies. Build automated online businesses, create SaaS products, and scale your income."
length:135
characters:135
words:17
charPerWord:7.94
number:1
metadata_info:
charset:"UTF-8"
canonical:"https://learnwithhasan.com/"
favicon:"https://learnwithhasan.com/wp-content/uploads/2024/10/cropped-hasan-homepage-32x32.webp"
viewport:"width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=1"
keywords:null
locale:"en_US"
contentType:"website"
site_name:"LearnWithHasan"
site_image:null
robots:"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
hreflangs:
Page Headings summary:
H1:2
H2:4
H3:4
H4:3
H5:0
H6:0
H1 count:2
H1 Content:"Home Page"
word_count:
total:477
Corrected word count:477
Anchor text words:60
Anchor Percentage:12.58
links_summary:
Total links:47
External links:29
Internal:18
Nofollow count:0
links:0:
href:"#"
text:""
1:
href:"https://learnwithhasan.com/"
text:""
2:
href:"https://learnwithhasan.com/learn/"
text:"Learn"
3:
href:"https://learnwithhasan.com/community/"
text:"Community"
4:
href:"#"
text:"Resources"
5:
href:"https://learnwithhasan.com/blog/"
text:"Blog"
6:
href:"/forum/"
text:"Forums"
7:
href:"https://learnwithhasan.com/newsletter/"
text:"Newsletter"
8:
href:"https://learnwithhasan.com/tools-i-use/"
text:"Tools I use"
9:
href:"#"
text:"Power Section"
10:
href:"https://learnwithhasan.com/roadmap/"
text:"Roadmap"
11:
href:"#"
text:"Tools"
12:
href:"https://learnwithhasan.com/llm-playground/"
text:"LLM Playground"
13:
href:"https://learnwithhasan.com/fastapi-monitoring-tool/"
text:"API Monitoring"
14:
href:"#"
text:"Data"
15:
href:"https://learnwithhasan.com/niche-database/"
text:"Niche Database"
16:
href:"https://learnwithhasan.com/prompts-library/"
text:"Prompts Library"
17:
href:"https://learnwithhasan.com/codes-library/"
text:"Codes Library"
18:
href:"#"
text:"Services"
19:
href:"/access-shortlinks-io/"
text:"Shorter Links"
20:
href:"/updow-service-access/"
text:"UpDown Monitor"
21:
href:"/website-monitor-service-access/"
text:"Website Analytics"
22:
href:"#"
text:""
23:
href:"https://learnwithhasan.com/user-login/"
text:"Sign in"
24:
href:"https://learnwithhasan.com/signup/"
text:"Sign up"
25:
href:"#"
text:""
26:
href:"https://learnwithhasan.com/"
text:""
27:
href:"#"
text:""
28:
href:"https://learnwithhasan.com/"
text:""
29:
href:"#"
text:""
30:
href:"/learn/"
text:"Learn"
31:
href:"https://learnwithhasan.com/community/"
text:"Community"
32:
href:"https://learnwithhasan.com/blog/"
text:"Blog"
33:
href:"https://learnwithhasan.com/forum/"
text:"Forums"
34:
href:"https://learnwithhasan.com/user-login/"
text:"Log In"
35:
href:"/about-me"
text:"Learn More About My Journey"
36:
href:"#get-free-kit"
text:"Get The Free Kit"
37:
href:"/membership-levels/"
text:"Join the Community"
38:
href:"https://learnwithhasan.com/privacy-policy/"
text:"Privacy Policy"
39:
href:"https://learnwithhasan.com/refund-policy/"
text:"Refund Policy"
40:
href:"https://learnwithhasan.com/terms/"
text:"Terms"
41:
href:"https://learnwithhasan.com/contact-us/"
text:"Contact Us"
42:
href:"https://www.youtube.com/@hasanaboulhasan"
text:""
43:
href:"https://www.linkedin.com/in/h-educate/"
text:""
44:
href:"https://hasanaboulhasan.medium.com/"
text:""
45:
href:"https://github.com/hassancs91?tab=repositories"
text:""
46:
href:"https://x.com/hasan_ab_hasan"
text:""
images_analysis:summary:
total:10
No src tag:0
No alt tag:0
data:0:
src:"https://learnwithhasan.com/wp-content/uploads/2024/09/learnwithhasan-logo-1.png"
alt:"learnwithhasan-logo"
1:
src:"https://learnwithhasan.com/wp-content/uploads/2024/10/learnwithhasanDark.png"
alt:"learnwithhasan Dark"
2:
src:"https://learnwithhasan.com/wp-content/uploads/2024/09/learnwithhasan-logo-1.png"
alt:"learnwithhasan-logo"
3:
src:"https://learnwithhasan.com/wp-content/uploads/2024/10/learnwithhasanDark.png"
alt:"learnwithhasan Dark"
4:
src:"https://learnwithhasan.com/wp-content/uploads/2024/09/learnwithhasan-logo-1.png"
alt:"learnwithhasan-logo"
5:
src:"/wp-content/uploads/2024/10/hasan-homepage.webp"
alt:"Digital Entrepreneurship Guide"
6:
src:"https://learnwithhasan.com/wp-content/uploads/2024/10/omar-review-150x150.jpg"
alt:"Omar"
7:
src:"https://learnwithhasan.com/wp-content/uploads/2024/10/bob-review-150x150.png"
alt:"Bob Truesdale"
8:
src:"https://learnwithhasan.com/wp-content/uploads/2024/10/james-review.jpg"
alt:"James Ruff"
9:
src:"/wp-content/uploads/20