<template>
  <div>
    <vue-headful title="Добро пожаловать | Leveler"/>
    <h4>Расчет долгов после вечеринки:</h4>
    <hr>
    <div class="check" v-for="check, check_index in this.tData">
      <div class="card border-primary">
        <div class="card-header">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">
                                <b>Чек #{{ (check_index + 1) }}:</b>
                            </span>
            </div>
            <input type="text" class="form-control" :value="check.check_name"
                   placeholder="Например: ЗА ЕДУ / ЗА ТАКСИ" @keyup="fillCheckName(check_index, $event)">
          </div>
        </div>
        <div class="card-body">
          <button class="btn btn-link" @click="addTAbleRow(check_index)">
            <i class="fas fa-plus"></i>
            Добавить участника в чек
          </button>
          <br>
          <div class="table-responsive">
            <table class="table table-striped table-hover table-bordered thead-light" id="pay_table">
              <thead>
              <tr>
                <th>Участник</th>
                <th style="width: 120px;">Сумма</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="el, i in check.data">
                <td>
                  <input type="text" class="form-control" :value="el.name"
                         @keyup="fillFieldName(check_index, i, $event)">
                </td>
                <td>
                  <input placeholder="0" type="number" class="form-control" :value="el.sum"
                         @keyup="fillFieldSum(check_index, i, $event)"
                         min="0">
                </td>
                <td class="icon_td">
                  <i class="fas fa-trash cursor_pointer" title="Удалить"
                     @click="remove(check_index, i)"></i>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer" v-if="del_fl">
          <button class="btn btn-danger" @click="removeCheck(check_index)">
            <i class="fas fa-trash-alt"></i>
            Удалить чек
          </button>
        </div>
      </div>
      <br>
      <b>Сумма за чек: {{ check.total_check }}</b>
      <hr>
    </div>
    <button class="btn btn-dark" @click="addCheck()">
      <i class="fas fa-receipt"></i>
      Добавить чек
    </button>
    <button class="btn btn-success btn-space" @click="payment()">
      <i class="fas fa-money-bill-wave"></i>
      Рассчитать чеки
    </button>
    <notifications group="info"></notifications>
    <button type="button" class="btn" data-toggle="modal" data-target="#result" id="resultBtn"></button>
    <div class="modal fade" id="result" tabindex="-1" role="dialog" aria-labelledby="resultLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="resultLabel">Результат</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <small>Поделиться чеком:</small>
              <div class="row">
                <div class="form-group mx-sm-3 mb-2 calc-input">
                  <input type="text" class="form-control" :value="this.encodeResult()"
                         id="encode-result">
                </div>
                <button type="button" class="btn btn-light mb-2" @click="copyCheck()">Скопировать
                </button>
              </div>
            </div>
            <div v-for="check in this.resData">
              <b>{{ check.check_name }} (Сумма чека: {{ check.total_check }})</b>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mb-3, .my-3 {
  margin-bottom: 0 !important;
}

.calc-input {
  width: calc(100% - 173px);
}

.card-body {
  padding-top: 0;
  padding-bottom: 0;
}

.border-primary {
  border-color: #d0d0d0 !important;
}

#resultBtn {
  display: none;
}

@media (max-width: 575px) {
  .calc-input {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>

<script>
export default {
  mounted() {
    this.checkDelFlag();
    this.calculateTotalSum();
  },

  data: function () {
    return {
      hint_flag: true,
      flag: false,
      del_fl: false,
      resData: [],
      tData: [
        {
          check_name: '',
          total_check: 0,
          data: [
            {
              name: '',
              sum: ''
            },
            {
              name: '',
              sum: ''
            },
          ]
        },
        // {
        //   check_name: 'За бар',
        //   total_check: 0,
        //   data: [
        //     {
        //       name: 'Андрей',
        //       sum: '2500'
        //     },
        //     {
        //       name: 'Роман',
        //       sum: '0'
        //     },
        //     {
        //       name: 'Влад',
        //       sum: '3000'
        //     },
        //     {
        //       name: 'Саня',
        //       sum: '3000'
        //     },
        //   ]
        // },
        // {
        //   check_name: 'За такси',
        // total_check: 0,
        //   data: [
        //     {
        //       name: 'Роман',
        //       sum: '70'
        //     },
        //     {
        //       name: 'Иван',
        //       sum: '80'
        //     }
        //   ]
        // },
      ],
    }
  },
  methods: {
    calculateTotalSum: function () {
      this.tData.forEach((check, i) => {
        this.tData[i].total_check = 0;
        check.data.forEach(payer => {
          this.tData[i].total_check += Number.parseFloat(payer.sum);
        });
      });
    },

    encodeResult: function () {
      return process.env.API_ADDR + '/#/check/' + btoa(encodeURI(JSON.stringify(this.resData)));
    },

    copyCheck: function () {
      let res = document.getElementById('encode-result');
      res.select();
      res.setSelectionRange(0, 99999);
      document.execCommand("copy");
    },

    notifyInfo: function (title, text) {
      this.$notify({
        group: 'info',
        title: title,
        text: text
      });
    },

    notifyError: function (title, text) {
      this.$notify({
        group: 'info',
        type: 'error',
        title: title,
        text: text
      });
    },

    checkDelFlag: function () {
      this.del_fl = this.tData.length > 1;
    },

    addTAbleRow: function (check_index) {
      this.tData[check_index]['data'].push({
        name: '',
        sum: ''
      });
    },

    payment: function () {
      this.flag = false;
      this.tData[0].data.forEach(el => {
        if (el.sum === '') {
          el.sum = 0;
        }
      });

      try {
        this.resData = [];
        this.tData.forEach(check => {
          let allSum = 0;
          let mostPaid = {
            name: undefined,
            sum: 0
          };
          let newMostPaid = [];

          check.data.forEach(el => {
            allSum += Number.parseFloat(el.sum);
            if (Number.parseFloat(mostPaid.sum) < Number.parseFloat(el.sum)) {
              mostPaid = el;
            }
          });

          check.data.forEach(el => {
            if (mostPaid.sum === el.sum) {
              newMostPaid.push(el);
            }
          });

          let debtList = [];
          check.data.forEach(el => {
            if (el.name === '') {
              el.name = '<Имя не указано>';
            }
            newMostPaid.forEach(paid => {
              if (el.name !== paid.name && el.sum !== paid.sum) {
                let refundAmount = ((allSum / check.data.length - el.sum) / newMostPaid.length).toFixed(2);
                if (refundAmount >= 0) {
                  debtList.push({
                    from: el.name,
                    to: paid.name,
                    sum: refundAmount
                  });
                } else {
                  debtList.push({
                    from: paid.name,
                    to: el.name,
                    sum: Math.abs(refundAmount)
                  });
                }
              }
            });
          });

          this.resData.push({
            check_name: check.check_name,
            total_check: check.total_check,
            debt_list: debtList
          });

          this.flag = true;
          document.getElementById('resultBtn').click();
        });
      } catch (e) {
        this.flag = false;
        this.notifyError('Ошибка!', 'Введены не корректные данные');
      }
    },

    fillFieldName: function (check_index, i, e) {
      this.tData[check_index]['data'][i].name = e.target.value;
      this.showHelpMsg();
    },

    fillFieldSum: function (check_index, i, e) {
      this.tData[check_index]['data'][i].sum = e.target.value;
      this.showHelpMsg();
      this.calculateTotalSum();
    },

    showHelpMsg: function () {
      if (this.hint_flag) {
        this.hint_flag = false;
        this.notifyInfo('Подсказка', 'Добавьте в чек только тех участников, между которыми хотите разделить сумму чека');
      }
    },

    remove: function (check_index, index) {
      this.tData[check_index]['data'].splice(index, 1);
    },

    removeCheck: function (check_index) {
      if (this.tData.length === 1) {
        this.addCheck();
      }
      this.tData.splice(check_index, 1);
      this.checkDelFlag();
    },

    fillCheckName: function (check_index, e) {
      if (this.hint_flag) {
        this.hint_flag = false;
        this.notifyInfo('Подсказка', 'Добавьте в чек только тех участников, между которыми хотите разделить сумму чека');
      }
      this.tData[check_index]['check_name'] = e.target.value;
    },

    addCheck: function () {
      this.tData.push(
        {
          check_name: '',
          total_check: '',
          data: [
            {
              name: '',
              sum: ''
            }
          ]
        }
      );
      this.checkDelFlag();
    }
  }
};
</script>
