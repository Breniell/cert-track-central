import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Database, Shield, CheckCircle } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ciment-green/10 via-background to-ciment-green-dark/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Building2 className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-ciment-green mb-4">
            Bienvenue sur CIMFORM
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Système complet de gestion des formations présentielles pour CIMENCAM
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-ciment-green/20">
            <CardHeader>
              <Database className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Base de données sécurisée</CardTitle>
              <CardDescription>
                13 tables avec Row Level Security (RLS) activé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Sites multi-usines
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Sessions de formation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Système de présence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Messagerie temps réel
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-ciment-green/20">
            <CardHeader>
              <Shield className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>RBAC Sécurisé</CardTitle>
              <CardDescription>
                Système de rôles et permissions complet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Super Admin
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  DRH / HR / HSE
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Manager / Formateur
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Apprenant
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-ciment-green/20">
            <CardHeader>
              <Users className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Modules complets</CardTitle>
              <CardDescription>
                Toutes les fonctionnalités prêtes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Gestion formateurs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Inscriptions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Matrices de formation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-ciment-green" />
                  Notifications
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="border-ciment-green/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-ciment-green/10 to-ciment-green-dark/10">
            <CardTitle className="text-2xl">🚀 Démarrage rapide</CardTitle>
            <CardDescription>Suivez ces étapes pour commencer à utiliser CIMFORM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Créer les données de test</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Utilisez la page de configuration pour créer automatiquement 9 utilisateurs de test avec différents rôles.
                  </p>
                  <Link to="/setup">
                    <Button>
                      Accéder à la configuration
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Se connecter avec un compte test</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Utilisez l'un des comptes créés pour tester les fonctionnalités selon le rôle.
                  </p>
                  <Link to="/auth">
                    <Button variant="outline">
                      Page de connexion
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Explorer le système</h3>
                  <p className="text-sm text-muted-foreground">
                    Chaque rôle a accès à différentes fonctionnalités. Testez avec plusieurs comptes pour voir toutes les possibilités.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
              <p className="text-sm">
                <strong>💡 Conseil :</strong> Les sites CIMENCAM (Douala, Figuil, Yaoundé) ont déjà été créés automatiquement dans la base de données.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
