<template>
    <div>
        <vue-headful title="Просмотр чека | Leveler"/>
        <h5>Просмотр чека</h5>
        <div v-for="check in this.data">
          <b>{{ check.check_name }} (Сумма чека: {{ check.total_check}})</b>
            <hr>
            <div class="table-responsive">
                <table class="table table-striped table-hover table-bordered thead-light">
                    <thead>
                    <tr>
                        <th>Кто отдает</th>
                        <th>Кому отдает</th>
                        <th>Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="el in check.debt_list">
                        <td>{{ el.from }}</td>
                        <td>{{ el.to }}</td>
                        <td>{{ el.sum }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <blockquote class="blockquote alert alert-danger" v-if="!this.success">
            Ошибка! Чек не найден.
        </blockquote>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.decode_data(this.$route.params.data)
        },
        data: function () {
            return {
                success: true,
                data: []
            }
        },
        methods: {
            decode_data: function (str) {
                this.success = false;
                this.data = JSON.parse(decodeURI(atob(str)));
                if (this.data.length > 0) {
                    this.success = true;
                } else {
                    this.success = false;
                }
                return this.data.data;
            }
        }
    }
</script>

