import { createApp } from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import VueAxios from "vue-axios";

import App from "@/App";
import Minefield from "@/components/Minefield";
import Home from "@/components/Home";
import axios from "axios";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/game/:difficulty',
        name: 'Game',
        component: Minefield
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App);

app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
