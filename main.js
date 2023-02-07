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
            errors: []
        }
    },
    methods: {
    },
    mounted() {
        eventBus.$on('addColumn1', card => {
            this.errors = []
            if (this.column1.length < 3){
                this.column1.push(card)
            } else {
                this.errors.push('NO MORE CARDS!')
            }
        })
        eventBus.$on('addColumn2', card => {
            this.errors = []
            if (this.column2.length < 5) {
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
            } else {
                this.errors.push("NO MORE CARDS! max :5 ")
            }
        })
        eventBus.$on('addColumn3', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })
        eventBus.$on('addColumn1-3', card => {
            this.column3.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
        })
    },
    computed: {

    }
})

Vue.component('column1', {
    template: `
        <div class="column">
            <div class="card" v-for="card in column1" :disabled="block">
                <h3>{{card.title}}</h3>
                <ul>
                    <li class="tasks" v-for="task in card.subtasks" 
                    v-if="task.title != null" 
                    @click="changeCompleted(card, task)" 
                    :class="{completed: task.completed}"
                    :disabled="task.completed">
                        {{task.title}}
                    </li>
                </ul>
            </div>
        </div>
    `,
    props: {
        column1: {
            type: Array,
        },
        column2: {
            type: Array,
        },
        card: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    methods: {
        changeCompleted(card, task) {
            task.completed = true
            card.status = 0
            let count = 0
            for(let i = 0; i < 5; i++){
                if (card.subtasks[i].title != null) {
                    count++
                }
            }
            console.log(card.status)
            console.log(count)

            for( let i = 0; i<5; i++){
                if (card.subtasks[i].completed === true){
                    card.status++
                }
            }

            if ((card.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn2', card)
            }
            if ((card.status / count) * 100 === 100) {
                card.date = new Date().toLocaleString()
                eventBus.$emit('addColumn1-3', card)
            }
        },
    },
    computed: {
        blocked(){
            if (this.errors.length === 2) {
                this.block = true
            }
        }
    },
    data(){
        return{
            block: false
        }
    },
})

Vue.component('column2', {
    template: `
     <div class="column">
        <div class="card" v-for="card in column2">
                  <h3>{{card.title}}</h3>
                <ul>
                    <li class="tasks" v-for="task in card.subtasks" 
                    v-if="task.title != null" 
                    @click="changeCompleted(card, task)" 
                    :class="{completed: task.completed}"
                    :disabled="task.completed">
                        {{task.title}}
                    </li>
                </ul>
        </div>
    `,
    props: {
        column2: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        changeCompleted(card, task) {
            task.completed = true
            card.status = 0
            let count = 0
            for(let i = 0; i < 5; i++){
                if (card.subtasks[i].title != null) {
                    count++
                }
            }
            for( let i = 0; i<5; i++){
                if (card.subtasks[i].completed === true){
                    card.status++
                }
            }

            if ((card.status / count) * 100 === 100) {
                eventBus.$emit('addColumn3', card)
                card.date = new Date().toLocaleString();
            }
        }
    }
})

Vue.component('column3', {
    template: `
        <div class="column">
        <div class="card" v-for="card in column3">
              <h3>{{card.title}}</h3>
                <ul>
                    <li class="tasks" v-for="task in card.subtasks" 
                    v-if="task.title != null" 
                    @click="changeCompleted(card, task)" 
                    :class="{completed: task.completed}">
                        {{task.title}}
                    </li>
                    <p>{{ card.date }}</p>
                </ul>
        </div>
    `,
    props: {
        column3: {
            type: Array
        },
        card: {
            type: Object
        }
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
                subtasks: [{title: this.subtask1, completed: false},
                    {title: this.subtask2, completed: false},
                    {title: this.subtask3, completed: false},
                    {title: this.subtask4, completed: false},
                    {title: this.subtask5, completed: false}],
                date: null,
                status: 0,
                errors: [],
            }
            eventBus.$emit('addColumn1', card)
            this.title = null
            this.subtask1 = null
            this.subtask2 = null
            this.subtask3 = null
            this.subtask4 = null
            this.subtask5 = null
            console.log(card)
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        type: 'all',
        list: JSON.parse(localStorage.getItem('card')) || [],
        errors:[],
        todo_new: null,
        description: null
    },
        watch: {
            list: {
                handler: function(list) {
                    localStorage.setItem('card', JSON.stringify(list));
                },
                deep: true
            }
        }
})(window);
