export class EmailTemplates {
  static welcomeEmailTemplate(username: string, email: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to StackUnity</title>
        </head>
        <body style="font-family: 'Figtree', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6200ea 0%, #3700b3 100%); padding: 20px; text-align: center;">
              <img src="https://stackunity.tech/images/logo.png" alt="StackUnity Logo" style="width: 80px; height: 80px; object-fit: contain;">
            </div>

            <div style="padding: 40px 30px;">
              <h1 style="color: #333; margin: 0 0 20px; font-size: 28px; text-align: center; font-weight: 600;">
                Welcome to StackUnity, ${username} !
              </h1>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                <p style="color: #666; margin: 0 0 15px; line-height: 1.6; font-size: 16px;">
                  We are thrilled to count you among our users. StackUnity is your one-stop solution for improving your web development and SEO performance.
                </p>
                
                <p style="color: #666; margin: 0 0 20px; line-height: 1.6; font-size: 16px;">
                  Your 7-day trial has started! Enjoy all our features:
                </p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                  <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="color: #6200ea; font-weight: 600; margin-bottom: 8px;">Complete analysis</div>
                    <div style="color: #666; font-size: 14px;">Website and SEO</div>
                  </div>
                  <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="color: #6200ea; font-weight: 600; margin-bottom: 8px;">Database design</div>
                    <div style="color: #666; font-size: 14px;">Intuitive design</div>
                  </div>
                  <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="color: #6200ea; font-weight: 600; margin-bottom: 8px;">Studio API</div>
                    <div style="color: #666; font-size: 14px;">Test and development</div>
                  </div>
                  <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="color: #6200ea; font-weight: 600; margin-bottom: 8px;">Accessibility</div>
                    <div style="color: #666; font-size: 14px;">Optimization tools</div>
                  </div>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="https://stackunity.tech/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6200ea 0%, #3700b3 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(98, 0, 234, 0.2);">
                  Access your dashboard
                </a>
              </div>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0 0 10px; font-size: 14px;">
                © ${new Date().getFullYear()} StackUnity. All rights reserved.
              </p>
              <p style="margin: 0;">
                <a href="https://stackunity.tech/privacy" style="color: #6200ea; text-decoration: none; margin-right: 15px; font-size: 14px;">Privacy policy</a>
                <a href="https://stackunity.tech/terms" style="color: #6200ea; text-decoration: none; font-size: 14px;">Terms of use</a>
              </p>
              <p style="color: #666; margin: 10px 0 0; font-size: 14px;">
                If you do not want to receive our emails, <a href="https://stackunity.tech/unsubscribe?email=${email}" style="color: #6200ea; text-decoration: none;">click here to unsubscribe</a>.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static trialEndingEmailTemplate(username: string, daysLeft: number, email: string): string {
    return `
      <div style="font-family: 'Figtree', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <header style="text-align: center; margin-bottom: 20px;">
          <img src="https://stackunity.tech/images/logo.png" alt="StackUnity Logo" style="width: 80px; height: 80px; object-fit: contain;">
        </header>
        
        <main style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #6200ea; margin-bottom: 20px;">Your trial is ending soon, ${username} !</h1>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">You have <strong>${daysLeft} day${daysLeft > 1 ? 's' : ''}</strong> left before your premium trial ends.</p>
          
              <p style="margin-bottom: 15px; line-height: 1.5;">To continue enjoying all premium features of StackUnity, we invite you to choose a subscription:</p>
          
          <div style="background-color: white; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h2 style="color: #6200ea; font-size: 18px;">Standard subscription</h2>
            <p style="margin-bottom: 10px;">Access to all essential features to improve your website.</p>
            <p style="font-weight: bold;">9,99€/month</p>
          </div>
          
          <div style="background-color: white; border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 2px solid #6200ea;">
            <h2 style="color: #6200ea; font-size: 18px;">Premium subscription</h2>
            <p style="margin-bottom: 10px;">Unlimited access to all advanced features and tools.</p>
            <p style="font-weight: bold;">19,99€/month</p>
          </div>
          
          <p style="margin-bottom: 20px;">
            <a href="https://stackunity.tech/pricing" style="background-color: #6200ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Choose my subscription</a>
          </p>
        </main>
        
        <footer style="text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} StackUnity. All rights reserved.</p>
          <p>
            <a href="https://stackunity.tech/privacy" style="color: #6200ea; text-decoration: none; margin-right: 10px;">Privacy policy</a>
            <a href="https://stackunity.tech/terms" style="color: #6200ea; text-decoration: none;">Terms of use</a>
          </p>
          <p>If you do not want to receive our emails, <a href="https://stackunity.tech/unsubscribe?email=${email}" style="color: #6200ea; text-decoration: none;">click here to unsubscribe</a>.</p>
        </footer>
      </div>
    `;
  }

  static paymentConfirmationEmailTemplate(username: string, planName: string, amount: string, email: string): string {
    return `
      <div style="font-family: 'Figtree', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <header style="text-align: center; margin-bottom: 20px;">
          <img src="https://stackunity.tech/images/logo.png" alt="StackUnity Logo" style="width: 80px; height: 80px; object-fit: contain;">
        </header>
        
        <main style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #6200ea; margin-bottom: 20px;">Thank you for your subscription, ${username} !</h1>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">We confirm that your payment of <strong>${amount}</strong> for the <strong>${planName}</strong> subscription has been received.</p>
          
          <div style="background-color: #e8f5e9; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32;"><strong>Payment status:</strong> Confirmed</p>
          </div>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">You can now enjoy all the features of your subscription.</p>
          
          <p style="margin-bottom: 20px;">
            <a href="https://stackunity.tech/dashboard" style="background-color: #6200ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Access your dashboard</a>
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.5; font-size: 14px;">To view your invoice or manage your subscription, please visit the "My account" section.</p>
        </main>
        
        <footer style="text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} StackUnity. All rights reserved.</p>
          <p>
            <a href="https://stackunity.tech/privacy" style="color: #6200ea; text-decoration: none; margin-right: 10px;">Privacy policy</a>
            <a href="https://stackunity.tech/terms" style="color: #6200ea; text-decoration: none;">Terms of use</a>
          </p>
          <p>If you do not want to receive our emails, <a href="https://stackunity.tech/unsubscribe?email=${email}" style="color: #6200ea; text-decoration: none;">click here to unsubscribe</a>.</p>
        </footer>
      </div>
    `;
  }
}

export class FeedbackEmailTemplates {
  static feedbackEmailTemplate(title: string, description: string, type: string, rating: string, email: string): string {
    const getTypeColor = (type: string) => {
      switch (type.toLowerCase()) {
        case 'bug':
          return '#ef5350';
        case 'suggestion':
          return '#7c4dff';
        case 'improvement':
          return '#4caf50';
        default:
          return '#9e9e9e';
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type.toLowerCase()) {
        case 'bug':
          return '🐛';
        case 'suggestion':
          return '💡';
        case 'improvement':
          return '🚀';
        default:
          return '📝';
      }
    };

    const getRatingStars = (rating: string) => {
      const numRating = parseFloat(rating);
      return '⭐'.repeat(Math.floor(numRating)) + (numRating % 1 ? '½' : '');
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Feedback - StackUnity</title>
        </head>
        <body style="font-family: 'Figtree', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #6200ea; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <img src="https://stackunity.tech/images/logo.png" alt="StackUnity Logo" style="width: 80px; height: 80px; object-fit: contain;">
            </div>

            <div style="padding: 30px;">
                  <h1 style="color: #333; margin: 0 0 20px; font-size: 24px;">New Feedback Received</h1>
              
              <div style="display: inline-block; background-color: ${getTypeColor(type)}; color: white; padding: 6px 12px; border-radius: 4px; margin-bottom: 20px;">
                ${getTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}
              </div>

              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 10px; font-size: 18px;">${title}</h2>
                <p style="color: #666; margin: 0 0 15px; line-height: 1.5;">${description}</p>
                
                  <div style="margin: 15px 0;">
                  <span style="color: #666; font-weight: 500;">Rating:</span>
                  <span style="color: #ff9800; margin-left: 8px;">${getRatingStars(rating)}</span>
                </div>

                <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
                  <p style="color: #666; margin: 0;">
                    <strong>Submitted by:</strong> ${email || 'Anonymous'}
                  </p>
                  <p style="color: #666; margin: 8px 0 0;">
                    <strong>Date:</strong> ${new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <div style="text-align: center; margin-top: 20px;">
                <a href="https://stackunity.tech/admin/feedback" style="display: inline-block; background-color: #6200ea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 500;">
                  View in Dashboard
                </a>
              </div>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                This is an automated message from StackUnity. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export class ErrorEmailTemplates {
  static errorEmailTemplate(error: string, errorStack: string, userEmail: string, userInfo: string, url: string, additionalInfo: string, currentDate: string, userAgent: string, userIp: string): string {
    const getBrowserInfo = (userAgent: string) => {
      const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE)[\/\s](\d+\.\d+)/i);
      return browser ? `${browser[1]} ${browser[2]}` : 'Unknown Browser';
    };

    const getOSInfo = (userAgent: string) => {
      const os = userAgent.match(/(Windows|Mac|Linux|Android|iOS)[\s\/](\d+\.\d+)?/i);
      return os ? os[1] : 'Unknown OS';
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error Report - StackUnity</title>
        </head>
        <body style="font-family: 'Figtree', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #ef5350; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <img src="https://stackunity.tech/images/logo.png" alt="StackUnity Logo" style="width: 80px; height: 80px; object-fit: contain;">
            </div>

            <div style="padding: 30px;">
              <h1 style="color: #333; margin: 0 0 20px; font-size: 24px;">Error Report</h1>
              
              <div style="background-color: #fff3f3; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef5350;">
                <h2 style="color: #ef5350; margin: 0 0 10px; font-size: 18px;">Error Message</h2>
                <p style="color: #333; margin: 0 0 15px; line-height: 1.5; font-family: monospace; white-space: pre-wrap;">${error}</p>
              </div>

              ${errorStack ? `
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin: 0 0 10px; font-size: 18px;">Stack Trace</h2>
                  <pre style="color: #666; margin: 0; font-family: monospace; white-space: pre-wrap; font-size: 12px;">${errorStack}</pre>
                </div>
              ` : ''}

              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px; font-size: 18px;">User Information</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <p style="color: #666; margin: 0 0 8px;">
                      <strong>User Email:</strong><br>
                      ${userEmail || 'Not provided'}
                    </p>
                    <p style="color: #666; margin: 0 0 8px;">
                      <strong>User Info:</strong><br>
                      ${userInfo || 'Not provided'}
                    </p>
                    <p style="color: #666; margin: 0 0 8px;">
                      <strong>IP Address:</strong><br>
                      ${userIp || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p style="color: #666; margin: 0 0 8px;">
                      <strong>Browser:</strong><br>
                      ${getBrowserInfo(userAgent)}
                    </p>
                    <p style="color: #666; margin: 0 0 8px;">
                      <strong>Operating System:</strong><br>
                      ${getOSInfo(userAgent)}
                    </p>
                    <p style="color: #666; margin: 0 0 8px;">
                      <strong>Date & Time:</strong><br>
                      ${currentDate}
                    </p>
                  </div>
                </div>
              </div>

              ${additionalInfo ? `
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin: 0 0 10px; font-size: 18px;">Additional Information</h2>
                  <p style="color: #666; margin: 0; line-height: 1.5;">${additionalInfo}</p>
                </div>
              ` : ''}

              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 10px; font-size: 18px;">URL</h2>
                <p style="color: #666; margin: 0; word-break: break-all;">${url || 'Not provided'}</p>
              </div>

              <div style="text-align: center; margin-top: 20px;">
                <a href="https://stackunity.tech/admin/errors" style="display: inline-block; background-color: #ef5350; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 500;">
                  View in Error Dashboard
                </a>
              </div>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                This is an automated error report from StackUnity. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export class WelcomeNewsletterEmailTemplate {
  static welcomeNewsletterEmailTemplate(email: string): string {
    return `
      <div style="font-family: 'Figtree', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <header style="text-align: center; margin-bottom: 20px;">
          <img src="https://stackunity.tech/logo/stackunity-logo.png" alt="StackUnity Logo" style="width: 80px; height: 80px; object-fit: contain;">
        </header>

        <main style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #6200ea; margin-bottom: 20px;">Welcome to StackUnity Newsletter, ${email} !</h1>

          <p style="margin-bottom: 15px; line-height: 1.5;">Thank you for subscribing to our newsletter. We're excited to have you on board!</p>

          <p style="margin-bottom: 15px; line-height: 1.5;">We will send you the latest news and updates about StackUnity.</p>

          <p style="margin-bottom: 15px; line-height: 1.5;">You can unsubscribe at any time by clicking the link below.</p>

          <p style="margin-bottom: 15px; line-height: 1.5;">Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
        </main>

        <footer style="text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} StackUnity. All rights reserved.</p>
        </footer>
      </div>
    `;
  }
}
