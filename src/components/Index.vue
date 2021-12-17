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
      <b>Сумма за чек: {{ check.total_check || 0 }}</b>
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
              Название чека: <b>{{ check.check_name || '-' }}</b><br>
              Сумма чека: <b>{{ (check.total_check || 0).toFixed(2) }}</b><br>
              Каждый заплатил по: <b>{{ (check.equal_payment || 0).toFixed(2) }}</b><br>
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
                    <td>{{ el.sum.toFixed(2) }}</td>
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
import process from "shelljs";

export default {
  mounted() {
    this.checkDelFlag();
    this.calculateTotalSum();
  },

  data: function () {
    return {
      hint_flag: true,
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
      this.resData = [];

      this.tData.forEach(check => {
        check.data.forEach(el => {
          if (el.name === '') {
            el.name = '<Имя не указано>';
          }

          if (el.sum === '') {
            el.sum = 0;
          }
        });

        try {
          let contributors = JSON.parse(JSON.stringify(check.data));
          let tmpArr = [];
          let totalValue = 0;
          let equalPayment = 0;
          let debtors = [];
          let lenders = [];
          let lender = null;
          let debtor = null;
          let values = [];
          let delta = 0;

          totalValue = contributors.reduce((p, c) => {
            return p + Number.parseFloat(c.sum);
          }, 0);

          equalPayment = totalValue / contributors.length;
          tmpArr = contributors.map((d) => {
            d.sum = equalPayment - d.sum;
            return d;
          });

          debtors = tmpArr.filter(function (item) {
            return item.sum > 0
          });

          lenders = tmpArr.filter(function (item) {
            return item.sum < 0
          });

          lender = lenders[0];
          debtor = debtors[0];
          values = [];
          delta = 0;

          while (lenders.length > 0 && debtors.length > 0) {
            lender = lender || lenders[0];
            debtor = debtor || debtors[0];
            delta = debtor.sum + lender.sum;

            if (delta < 0) {
              values.push({
                from: debtor.name,
                to: lender.name,
                sum: debtor.sum
              });

              lender.sum += debtor.sum;
              debtor.sum = 0;
            } else {
              values.push({
                from: debtor.name,
                to: lender.name,
                sum: -lender.sum
              });

              debtor.sum += lender.sum;
              lender.sum = 0;
            }

            if (debtor.sum === 0) {
              debtors.splice(0, 1);
              debtor = null;
            }

            if (lender.sum === 0) {
              lenders.splice(0, 1);
              lender = null;
            }

            delta = 0;
          }

          this.resData.push({
            check_name: check.check_name,
            total_check: check.total_check,
            equal_payment: equalPayment,
            debt_list: values
          });

          document.getElementById('resultBtn').click();
        } catch (e) {
          this.notifyError('Ошибка!', 'Введены не корректные данные');
        }
      });
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
            },
            {
              name: '',
              sum: ''
            },
          ]
        }
      );
      this.checkDelFlag();
    }
  }
};
</script>
