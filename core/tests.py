from django.test import TestCase
from django.urls import reverse


class FrontendRouteTests(TestCase):
    def test_frontend_routes_render_the_spa_shell(self):
        routes = (
            'frontend-home',
            'frontend-login',
            'frontend-register',
            'frontend-pokedex',
            'frontend-pokemon-create',
            'frontend-pokemon-edit',
        )
        for route in routes:
            with self.subTest(route=route):
                args = (17,) if route == 'frontend-pokemon-edit' else ()
                response = self.client.get(reverse(route, args=args))
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, 'id="root"')
                self.assertContains(response, 'static/frontend/assets/app.js')
                self.assertContains(response, 'static/frontend/assets/app.css')

    def test_pokemon_detail_route_renders_the_spa_shell(self):
        response = self.client.get(reverse('frontend-pokemon-detail', args=(17,)))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'id="root"')

    def test_unknown_api_routes_are_not_handled_by_the_frontend(self):
        response = self.client.get('/api/not-a-route/')

        self.assertEqual(response.status_code, 404)
