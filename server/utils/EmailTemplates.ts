export class EmailTemplates {
  static welcomeEmailTemplate(username: string, email: string): string {
    return `
      <div style="font-family: 'Figtree', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <header style="text-align: center; margin-bottom: 30px;">
          <img src="https://stackunity.tech/logo/stackunity-logo.png" alt="StackUnity Logo" style="max-width: 200px;">
        </header>
        
        <main style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #6200ea; margin-bottom: 20px;">Welcome to StackUnity, ${username} !</h1>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">We are thrilled to count you among our users. StackUnity is your one-stop-shop for improving your web development and SEO performance.</p>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">Your 7-day trial has begun! Enjoy all our features:</p>
          
          <ul style="margin-bottom: 20px; line-height: 1.5;">
            <li>Complete website and SEO analysis</li>
            <li>Database design</li>
            <li>API testing and development studio</li>
            <li>Accessibility tools</li>
          </ul>
          
          <p style="margin-bottom: 20px;">
            <a href="https://stackunity.tech/dashboard" style="background-color: #6200ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Accéder à mon tableau de bord</a>
          </p>
        </main>
        
        <footer style="text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} StackUnity. Tous droits réservés.</p>
          <p>
            <a href="https://stackunity.tech/privacy" style="color: #6200ea; text-decoration: none; margin-right: 10px;">Privacy policy</a>
            <a href="https://stackunity.tech/terms" style="color: #6200ea; text-decoration: none;">Terms of use</a>
          </p>
          <p>If you do not want to receive our emails, <a href="https://stackunity.tech/unsubscribe?email=${email}" style="color: #6200ea; text-decoration: none;">click here to unsubscribe</a>.</p>
        </footer>
      </div>
    `;
  }

  static trialEndingEmailTemplate(username: string, daysLeft: number, email: string): string {
    return `
      <div style="font-family: 'Figtree', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <header style="text-align: center; margin-bottom: 30px;">
          <img src="https://stackunity.tech/logo/stackunity-logo.png" alt="StackUnity Logo" style="max-width: 200px;">
        </header>
        
        <main style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #6200ea; margin-bottom: 20px;">Votre période d'essai se termine bientôt, ${username} !</h1>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">Il vous reste <strong>${daysLeft} jour${daysLeft > 1 ? 's' : ''}</strong> avant la fin de votre période d'essai premium.</p>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">Pour continuer à profiter de toutes les fonctionnalités premium de StackUnity, nous vous invitons à choisir un abonnement :</p>
          
          <div style="background-color: white; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h2 style="color: #6200ea; font-size: 18px;">Abonnement Standard</h2>
            <p style="margin-bottom: 10px;">Accès à toutes les fonctionnalités essentielles pour améliorer votre site web.</p>
            <p style="font-weight: bold;">9,99€/mois</p>
          </div>
          
          <div style="background-color: white; border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 2px solid #6200ea;">
            <h2 style="color: #6200ea; font-size: 18px;">Abonnement Premium</h2>
            <p style="margin-bottom: 10px;">Accès illimité à toutes les fonctionnalités et outils avancés.</p>
            <p style="font-weight: bold;">19,99€/mois</p>
          </div>
          
          <p style="margin-bottom: 20px;">
            <a href="https://stackunity.tech/pricing" style="background-color: #6200ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Choisir mon abonnement</a>
          </p>
        </main>
        
        <footer style="text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} StackUnity. Tous droits réservés.</p>
          <p>
            <a href="https://stackunity.tech/privacy" style="color: #6200ea; text-decoration: none; margin-right: 10px;">Politique de confidentialité</a>
            <a href="https://stackunity.tech/terms" style="color: #6200ea; text-decoration: none;">Conditions d'utilisation</a>
          </p>
          <p>Si vous ne souhaitez plus recevoir nos emails, <a href="https://stackunity.tech/unsubscribe?email=${email}" style="color: #6200ea; text-decoration: none;">cliquez ici pour vous désabonner</a>.</p>
        </footer>
      </div>
    `;
  }

  static paymentConfirmationEmailTemplate(username: string, planName: string, amount: string, email: string): string {
    return `
      <div style="font-family: 'Figtree', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <header style="text-align: center; margin-bottom: 30px;">
          <img src="https://stackunity.tech/logo/stackunity-logo.png" alt="StackUnity Logo" style="max-width: 200px;">
        </header>
        
        <main style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #6200ea; margin-bottom: 20px;">Merci pour votre abonnement, ${username} !</h1>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">Nous vous confirmons que votre paiement de <strong>${amount}</strong> pour l'abonnement <strong>${planName}</strong> a bien été reçu.</p>
          
          <div style="background-color: #e8f5e9; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32;"><strong>Statut du paiement:</strong> Confirmé</p>
          </div>
          
          <p style="margin-bottom: 15px; line-height: 1.5;">Vous pouvez désormais profiter de toutes les fonctionnalités de votre abonnement.</p>
          
          <p style="margin-bottom: 20px;">
            <a href="https://stackunity.tech/dashboard" style="background-color: #6200ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Accéder à mon tableau de bord</a>
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.5; font-size: 14px;">Pour consulter votre facture ou gérer votre abonnement, rendez-vous dans la section "Mon compte".</p>
        </main>
        
        <footer style="text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} StackUnity. Tous droits réservés.</p>
          <p>
            <a href="https://stackunity.tech/privacy" style="color: #6200ea; text-decoration: none; margin-right: 10px;">Politique de confidentialité</a>
            <a href="https://stackunity.tech/terms" style="color: #6200ea; text-decoration: none;">Conditions d'utilisation</a>
          </p>
          <p>Si vous ne souhaitez plus recevoir nos emails, <a href="https://stackunity.tech/unsubscribe?email=${email}" style="color: #6200ea; text-decoration: none;">cliquez ici pour vous désabonner</a>.</p>
        </footer>
      </div>
    `;
  }
} 