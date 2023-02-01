let eventBus = new Vue()

Vue.component('cols', {
    template: `
    <div id="cols">
        <p class="error" v-for="error in errors">{{error}}</p>
        <newcard></newcard>
        <div class="col">
            <ul>
                <li class="cards" v-for="card in column1"><p>{{ card.title }}</p><p>{{ card.status }}</p>
                    <ul>
                        <li class="tasks" v-for="t in card.subtasks" v-if="t.title != null">
                            <input @click="t.completed = true"
                            class="checkbox" type="checkbox"
                            :disabled="t.completed">
                            <p :class="{completed: t.completed}">{{t.title}}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    <div class="col">
            <ul>
                <li class="cards" v-for="card in column2"><p>{{ card.title }}</p><p>{{ card.status }}</p><p>{{ card.date }}</p>
                    <ul>
                        <li class="tasks" v-for="t in card.subtasks" v-if="t.title != null">
                            <input @click="t.completed = true" 
                            @click="newStatus"
                            class="checkbox" type="checkbox"
                            :disabled="t.completed">
                            <p :class="{completed: t.completed}">{{t.title}}</p>
                            
                        </li>
                        
                    </ul>
                </li>
            </ul>
        </div>
        <div class="col">
            <ul>
                <li class="cards" v-for="card in column3"><p>{{ card.title }}</p><p>{{ card.status }}</p><p>{{ card.date }}</p>
                    <ul>
                        <li class="tasks" v-for="t in card.subtasks" v-if="t.title != null">
                            <input @click="t.completed = true" 
                            @click="newStatus"
                            class="checkbox" type="checkbox"
                            :disabled="t.completed">
                            <p :class="{completed: t.completed}">{{t.title}}</p>
                            
                        </li>
                        
                    </ul>
                </li>
            </ul>
        </div>
    </div>
 `,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            errors: []
        }
    },
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Practice'
    },
    methods: {

    }
})