export default defineEventHandler(async (event) => {
  try {
    console.log('API update-premium appelée');

    // Vérification de l'authentification
    const token = getRequestHeader(event, 'Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Token manquant dans la requête');
      return {
        success: false,
        error: 'Non autorisé: token manquant'
      };
    }

    // Récupération des données de la requête
    const body = await readBody(event);
    const { isPremium } = body;

    console.log(`Mise à jour du statut premium à: ${isPremium ? 'Premium' : 'Standard'}`);

    if (isPremium === undefined) {
      return {
        success: false,
        error: 'Paramètre isPremium requis'
      };
    }

    // En situation réelle, nous vérifierions le token et mettrions à jour la base de données
    // Pour cette démo, on simule une vérification de token et une mise à jour réussie

    console.log(`Mise à jour du statut premium pour l'utilisateur avec token à ${isPremium ? 'Premium' : 'Standard'}`);

    // Pour cette démonstration, on simule une réponse réussie
    return {
      success: true,
      message: `Le statut premium a été mis à jour avec succès: ${isPremium ? 'activé' : 'désactivé'}`
    };

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut premium:', error);

    return {
      success: false,
      error: 'Erreur lors de la mise à jour du statut premium'
    };
  }
}); 