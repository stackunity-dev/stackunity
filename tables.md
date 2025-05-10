TABLE analytis_sessions : 

session_id
website_id
visitor_id
start_time
end_time
duration
device_type
browser
os
referrer
landing_page
exit_page
is_bounce
is_complete
last_activity
is_short_session
referrer_source
referrer_name

TABLE analytics_pageviews : 

pageview_id
session_id
website_id
page_url
page_title
enter_time
exit_time
duration
scroll_depth
utm_source
utm_medium
utm_campaign
referrer
is_short_visit
referrer_source
referrer_name

TABLE analytics_interactions : 

interaction_id
pageview_id
website_id
session_id
interaction_type
element_selector
element_text
timestamp
value_data
page_url