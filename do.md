] 
[stackunity] [2025-04-24 09:54:08] > start
[stackunity] [2025-04-24 09:54:08] > node .output/server/index.mjs
[stackunity] [2025-04-24 09:54:08] 
[stackunity] [2025-04-24 09:54:09] Listening on http://[::]:8080
[stackunity] [2025-04-24 09:56:05] [API] Chargement des schémas SQL pour l'utilisateur (token): 18
[stackunity] [2025-04-24 09:56:05] [API] Chargement des schémas SQL pour l'utilisateur (token): 18
[stackunity] [2025-04-24 09:57:05] Erreur dans le webhook: StripeSignatureVerificationError: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? 
[stackunity] [2025-04-24 09:57:05]  If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.
[stackunity] [2025-04-24 09:57:05] 
[stackunity] [2025-04-24 09:57:05] Learn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature
[stackunity] [2025-04-24 09:57:05] 
[stackunity] [2025-04-24 09:57:05]     at validateComputedSignature (file:///workspace/.output/server/node_modules/stripe/esm/Webhooks.js:139:19)
[stackunity] [2025-04-24 09:57:05]     at Object.verifyHeader (file:///workspace/.output/server/node_modules/stripe/esm/Webhooks.js:62:13)
[stackunity] [2025-04-24 09:57:05]     at Object.constructEvent (file:///workspace/.output/server/node_modules/stripe/esm/Webhooks.js:10:32)
[stackunity] [2025-04-24 09:57:05]     at Object.handler (file:///workspace/.output/server/chunks/routes/api/index2.mjs:1:756)
[stackunity] [2025-04-24 09:57:05]     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
[stackunity] [2025-04-24 09:57:05]     at async Object.handler (file:///workspace/.output/server/chunks/nitro/nitro.mjs:1:33781)
[stackunity] [2025-04-24 09:57:05]     at async Server.<anonymous> (file:///workspace/.output/server/chunks/nitro/nitro.mjs:1:36971) {
[stackunity] [2025-04-24 09:57:05]   type: 'StripeSignatureVerificationError',
[stackunity] [2025-04-24 09:57:05]   raw: {
[stackunity] [2025-04-24 09:57:05]     message: 'No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? \n' +
[stackunity] [2025-04-24 09:57:05]       ' If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.\n' +
[stackunity] [2025-04-24 09:57:05]       '\n' +
[stackunity] [2025-04-24 09:57:05]       'Learn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature\n'
[stackunity] [2025-04-24 09:57:05]   },
[stackunity] [2025-04-24 09:57:05]   rawType: undefined,
[stackunity] [2025-04-24 09:57:05]   code: undefined,
[stackunity] [2025-04-24 09:57:05]   doc_url: undefined,
[stackunity] [2025-04-24 09:57:05]   param: undefined,
[stackunity] [2025-04-24 09:57:05]   detail: undefined,
[stackunity] [2025-04-24 09:57:05]   headers: undefined,
[stackunity] [2025-04-24 09:57:05]   requestId: undefined,
[stackunity] [2025-04-24 09:57:05]   statusCode: undefined,
[stackunity] [2025-04-24 09:57:05]   userMessage: undefined,
[stackunity] [2025-04-24 09:57:05]   charge: undefined,
[stackunity] [2025-04-24 09:57:05]   decline_code: undefined,
[stackunity] [2025-04-24 09:57:05]   payment_intent: undefined,
[stackunity] [2025-04-24 09:57:05]   payment_method: undefined,
[stackunity] [2025-04-24 09:57:05]   payment_method_type: undefined,
[stackunity] [2025-04-24 09:57:05]   setup_intent: undefined,
[stackunity] [2025-04-24 09:57:05]   source: undefined,
[stackunity] [2025-04-24 09:57:05]   header: 't=1745488625,v1=a9504a4771756e7e2d8a2235dd931f1ad1f494ea8d4813a0bdf51c79a2b93489',
[stackunity] [2025-04-24 09:57:05]   payload: '{"id":"evt_3RHMWhL1ZwIYz99y0r7Lj50d","object":"event","api_version":"2025-02-24.acacia","created":1745488624,"data":{"object":{"id":"pi_3RHMWhL1ZwIYz99y0cdFlAL8","object":"payment_intent","amount":101,"amount_capturable":0,"amount_details":{"tip":{}},"amount_received":101,"application":null,"application_fee_amount":null,"automatic_payment_methods":{"allow_redirects":"always","enabled":true},"canceled_at":null,"cancellation_reason":null,"capture_method":"automatic_async","client_secret":"pi_3RHMWhL1ZwIYz99y0cdFlAL8_secret_RYi6WBU7TJCM9L7DFcpuIA2SQ","confirmation_method":"automatic","created":1745488623,"currency":"eur","customer":"cus_SBk039JRNqLsoZ","description":null,"invoice":null,"last_payment_error":null,"latest_charge":"ch_3RHMWhL1ZwIYz99y0QIpiVN4","livemode":true,"metadata":{"discount_description":"30% de réduction","base_amount":"120","tax_amount":"17","promo_code":"WELCOME20","customer_email":"djedidinur@gmail.com","selected_plan":"standard","customer_name":"nur ddjedidi","discount_amount":"36","is_business":"false","customer_id":"18","tax_rate":"20.24","country_code":"FR","vat_number":""},"next_action":null,"on_behalf_of":null,"payment_method":"pm_1RHMWhL1ZwIYz99ybQlEpevs","payment_method_configuration_details":{"id":"pmc_1R8HFaL1ZwIYz99yilVTBynn","parent":null},"payment_method_options":{"bancontact":{"preferred_language":"en"},"card":{"installments":null,"mandate_options":null,"network":null,"request_three_d_secure":"automatic"},"eps":{},"klarna":{"preferred_locale":null},"link":{"persistent_token":null}},"payment_method_types":["card","bancontact","eps","klarna","link"],"processing":null,"receipt_email":null,"review":null,"setup_future_usage":null,"shipping":null,"source":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}},"livemode":true,"pending_webhooks":1,"request":{"id":"req_aZZGfwxACKjqtU","idempotency_key":"8de168e3-5432-41bc-9133-616198eef3b9"},"type":"payment_intent.succeeded"}'
[stackunity] [2025-04-24 09:57:05] }
