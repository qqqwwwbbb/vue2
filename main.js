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
    methods: {
        newStatus(card, t) {
            t.completed = true
            let count = 0

            for (let i = 0; i < 5; i++) {
                if (card.subtasks[i].title != null) {
                    count++
                    if (card.subtasks[i].completed) {
                        card.status++
                    }
                }
            }

            if (card.status/count*100 >= 50) {
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
            } else if (card.status/count*100 === 100) {
                this.column3.push(card)
                this.column2.splice(this.column2.indexOf(card), 1)
                this.column3.card.date = new Date()
            }

        }
    },
    props: {
        card: {
            title: {
                type: Text,
                required: true
            },
            subtasks: {
                type: Array,
                required: true,
                completed: {
                    type: Boolean,
                    required: true
                }
            },
            date: {
                type: Date,
                required: false
            },
            status: {
                type: Number,
                required: true
            }
        },

    },
    mounted() {
        eventBus.$on('card-submitted', card => {
            this.errors = []
            if (this.column1.length < 3){

                this.column1.push(card)
            } else {
                this.errors.push("You shall not pass !")
            }
        })
    },
})

Vue.component('newcard', {
    template: `
    <form class="addform" @submit.prevent="onSubmit">
        <p>
            <label for="title"> ↓ Fill the data</label>
            <br>
            <input class="title" required v-model="title" maxlength="50" type="text" placeholder="title">
        </p>
        <br>
        <div>
            <input required id="subtask1" v-model="subtask1" maxlength="50" type="text" placeholder="subtask">
        </div>
        <div>
            <input required id="subtask2" v-model="subtask2" maxlength="50" type="text" placeholder="subtask">
        </div>
        <div>
            <input required id="subtask3" v-model="subtask3" maxlength="50" type="text" placeholder="subtask">
        </div>
        <div>
            <input  id="subtask4" v-model="subtask4" maxlength="50" type="text" placeholder="subtask">
        </div>
        <div>
            <input  id="subtask5" v-model="subtask5" maxlength="50" type="text" placeholder="subtask">
        </div>
        <button type="submit">Add a card</button>
    </form>
    `,
    data() {
        return {
            title: null,
            subtask1: null,
            subtask2: null,
            subtask3: null,
            subtask4: null,
            subtask5: null,
            errors: [],
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        name: 'Practice'
    },
    methods: {

    }
})