let eventBus = new Vue()

Vue.component('cols', {
    template:`
    <div id="cols">
        <p class="error" v-for="error in errors">{{error}}</p>
        <newcard></newcard>
        <div class="col">
                <div>
                    <h2>Новые</h2>
                    <column1 :column1="column1" :column2="column2"></column1>
                </div>
        </div>
        <div class="col">
                <div>
                    <h2>В прогрессе</h2>
                    <column2 :column2="column2"></column2>
                </div>
        </div>
        <div class="col">
                <div>
                    <h2>Выполненные</h2>
                    <column3 :column3="column3"></column3>
                </div>
        </div>
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            addCard: false,
            errors: []
        }
    },
    methods: {
        changeModal() {
            this.addCard = !this.addCard
            console.log(this.addCard)
        }
    },
    mounted() {
        eventBus.$on('card-submitted', card => {
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(card)
            } else {
                this.errors.push("You can't add a new card now.")
            }
        })
        eventBus.$on('addColumn1', card => {
            if (this.column1.length < 3){
                this.column1.push(card)
            }
        })
        eventBus.$on('addColumn2', card => {
            if(this.column2.length < 5){
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
            }
        })
        eventBus.$on('addColumn3', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)

        })
        eventBus.$on('addColumn13', card => {
            this.column3.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)

        })
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
            },
            errors: {
                type: Array,
                required: false
            }
        },

    },
    computed: {

    }
})

Vue.component('column1', {
    template: `
        <div class="column">
            <div class="card" v-for="card in column1">
                <note :card="card" :changeCompleted="changeCompleted"></note>
            </div>
        </div>
    `,
    props: {
        column1: {
            type: Array,
            required: false
        },
        column2: {
            type: Array,
            required: false
        },
    },
    methods: {
        changeCompleted(card) {
            let allTask = 0
            for(let i = 0; i < 5; i++){
                if (card.subtasks[i].title != null) {
                    allTask++
                }
            }
            if ((card.status / allTask) * 100 >= 50 && this.column2.length < 5) {
                eventBus.$emit('addColumn2', card)
                this.column1.splice(this.column1.indexOf(card), 1)
            }
        },
    },
})

Vue.component('column2', {
    template: `
     <div class="column">
            <div class="card" v-for="card in column2">
                <note :card="card" :changeCompleted="changeCompleted"></note>
            </div>
        </div>
    `,
    props: {
        column2: {
            type: Array,
            required: false
        },
    },
    methods: {
        changeCompleted(card) {
            let allTask = 0
            for(let i = 0; i < 5; i++){
                if (card.subtasks[i].title != null) {
                    allTask++
                }
            }
            if ((card.status / allTask) * 100 === 100) {
                eventBus.$emit('addColumn3', card)
                this.column2.splice(this.column2.indexOf(card), 1)
                card.date = new Date().toLocaleString();
            }
        }
    }
})

Vue.component('column3', {
    template: `
        <div class="column">
            <div class="card" v-for="card in column3">
                <note :card="card"></note>
            </div>
        </div>
    `,
    props: {
        column3: {
            type: Array,
            required: false
        }
    }
})

Vue.component('note', {
    template: `
        <div>
            <h2>{{card.title}}</h2>  
            <ul>
                <li
                    v-for="tsk in card.subtasks" 
                    v-if="tsk.title != null"
                    @click="tsk.completed = true, card.status += 1, changeCompleted(card)"
                    :class="{ completedTask: tsk.completed }"
                >{{tsk.title}}</li>
                <h2>{{ card.date }}</h2>
            </ul>
        </div>
    `,
    props: {
        card: {
            type: Object
        },
        changeCompleted: {
            type: Function
        },
    }
})

Vue.component('newcard', {
    template: `
    <form class="addform" @submit.prevent="onSubmit">
        <p>
            <label for="title">↓ Fill out : </label>
            <br>
            <input class="title" required v-model="title" maxlength="30" type="text" placeholder="title">
        </p>
        <div>
            <input required id="subtask1" v-model="subtask1" maxlength="30" type="text" placeholder="subtask">
        </div>
        <div>
            <input required id="subtask2" v-model="subtask2" maxlength="30" type="text" placeholder="subtask">
        </div>
        <div>
            <input required id="subtask3" v-model="subtask3" maxlength="30" type="text" placeholder="subtask">
        </div>
        <div>
            <input  id="subtask4" v-model="subtask4" maxlength="30" type="text" placeholder="subtask">
        </div>
        <div>
            <input  id="subtask5" v-model="subtask5" maxlength="30" type="text" placeholder="subtask">
        </div>
        <button class="zxc" type="submit">Add a card</button>
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
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                subtasks: [{id:1, title: this.subtask1, completed: false},
                    {id:2, title: this.subtask2, completed: false},
                    {id:3, title: this.subtask3, completed: false},
                    {id:4, title: this.subtask4, completed: false},
                    {id:5, title: this.subtask5, completed: false}],
                date: null,
                status: 0,
                errors: [],
            }
            eventBus.$emit('card-submitted', card)
            this.title = null
            this.subtask1 = null
            this.subtask2 = null
            this.subtask3 = null
            this.subtask4 = null
            this.subtask5 = null
        },
        props: {
            column1:{
                type:Array,
                required: false
            },
            changeModal: {
                type: Function
            }
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Practicee'
    },
    methods: {

    }
})
