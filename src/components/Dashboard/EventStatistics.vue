<template>
  <b-row>
    <b-col cols="12">
      
      <span class="text"><i class="fas fa-chart-line iconNormal"> Gallery statistics</i></span>
    </b-col>
    <b-col cols="12">
      <b-row>
        <b-col cols="12" lg="3">
          <b-row class="block" align-v="center">
            <b-col cols="4" class="text-center">
              <i class="fas fa-eye"></i>
            </b-col>
            <b-col cols="8" align-self="center">
              <div>
                <p class="stats-number">{{ stats.IMV || 0 }}</p>
                <p class="stats-name">IMAGE VIEWS</p>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" lg="3">
          <b-row class="block" align-v="center">
            <b-col cols="4" class="text-center">
              <i class="fas fa-search"></i>
            </b-col>
            <b-col cols="8" align-self="center">
              <div>
                <p class="stats-number">{{ stats.SBR || 0 }}</p>
                <p class="stats-name">IMAGE SEARCHES</p>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" lg="3">
          <b-row class="block" align-v="center">
            <b-col cols="4" class="text-center">
              <i class="fas fa-arrow-down"></i>
            </b-col>
            <b-col cols="8" align-self="center">
              <div>
                <p class="stats-number">{{ stats.IMD + stats.PEML || 0 }}</p>
                <p class="stats-name">IMAGE DOWNLOADS</p>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" lg="3">
          <b-row class="block" align-v="center">
            <b-col cols="4" class="text-center">
              <i class="fas fa-share-alt"></i>
            </b-col>
            <b-col cols="8" align-self="center">
              <div>
                <p class="stats-number">{{ stats.IMS || 0 }}</p>
                <p class="stats-name">IMAGE SHARES</p>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div v-show="((getSelectedEvent.setting.photos_purchase == 1) && sales && sales.totalSales > 0)">
        <b-row>
          <b-col cols="12">
            <span class="text">Sales statistics</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" lg="3">
            <b-row class="block" align-v="center">
              <b-col cols="4" class="text-center">
              <i class="fas fa-image"></i>
              </b-col>
              <b-col cols="8" align-self="center">
                <div>
                  <p class="stats-number">
                    {{ sales.single || `N/A` }} @ 
                    {{ sales.singlePrice ? sales.singlePrice.price + ' ' + sales.singlePrice.currency : `N/A` }}
                  </p>
                  <p class="stats-name">Single</p>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12" lg="3">
            <b-row class="block" align-v="center">
              <b-col cols="4" class="text-center">
                <i class="fas fa-images"></i>
              </b-col>
              <b-col cols="8" align-self="center">
                <div>
                  <p class="stats-number">
                    {{ sales.batch || `N/A` }} @ 
                    {{ sales.batchPrice ? sales.batchPrice.price + ' ' + sales.batchPrice.currency : `N/A` }}
                  </p>
                  <p class="stats-name">Batch</p>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12" lg="3">
            <b-row class="block" align-v="center">
              <b-col cols="4" class="text-center">
                <i class="fas fa-balance-scale"></i>
              </b-col>
              <b-col cols="8" align-self="center">
                <div>
                  <p class="stats-number">
                    {{ sales.averageImagesPerBatch || `N/A` }}
                  </p>
                  <p class="stats-name">Avg images / batch</p>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12" lg="3">
            <b-row class="block" align-v="center">
              <b-col cols="4" class="text-center">
                <i class="fas fa-dollar-sign"></i>
              </b-col>
              <b-col cols="8" align-self="center">
                <div>
                  <p class="stats-number">
                    {{ sales.singlePrice ? sales.totalSales.toFixed(2) + ' ' + sales.singlePrice.currency : `N/A` }}
                  </p>
                  <p class="stats-name">Total Sales</p>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
      <div v-show="((getSelectedEvent.setting.photos_purchase == 1) && sales && sales.transactionHistory && sales.totalSales > 0)"
        class="transaction-history-chart-wrapper">
        <b-row>
          <b-col cols="12">
            <span class="text">Trailing 28-day SALES</span>
          </b-col>
          <b-col cols="12">
            <bar-chart
              v-if="this.sales && this.sales.transactionHistory"
              id="transaction-history-chart"
              :extra-options="chartOptions"
              :chartData="transactionHistoryChartData"
              :plugins="plugin"
            />
          </b-col>
        
      </b-row>
      </div>
      <div v-show="((getSelectedEvent.setting.photos_purchase == 1) && sales && sales.totalSales > 0)"
        class="reports-wrapper"
        >
        <b-row>
          <b-col cols="12" lg="6">
            <div class="sub-reports-wrapper">
              <b-row>
                <span class="text">TRANSACTION REPORTS</span>
              </b-row>
              <b-row v-for="(transactionReportItem, index) in transactionReportRows" :key="index">
                <b-col cols="6">
                  <a @click="downloadReport(transactionReportItem[0])">
                    {{ transactionReportItem[0].name }}
                  </a>
                </b-col>
                <b-col cols="6">
                  <a v-if="transactionReportItem[1]" @click="downloadReport(transactionReportItem[1])">
                   {{ transactionReportItem[1].name || '' }}
                  </a>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6">
                  <a @click="downloadReport(transactionAllReport)">All Transactions</a>
                </b-col>
              </b-row>
            </div>
          </b-col>
          <b-col cols="12" lg="6">
            <div class="sub-reports-wrapper">
              <b-row>
                <span class="text">IMAGE SALES REPORTS</span>
              </b-row>
              <b-row v-for="(imageSalesReportItem, index) in imageSalesReportRows" :key="index">
                <b-col cols="6">
                  <a @click="downloadReport(imageSalesReportItem[0])">
                    {{ imageSalesReportItem[0].name }}
                  </a>
                </b-col>
                <b-col cols="6">
                  <a v-if="imageSalesReportItem[1]" @click="downloadReport(imageSalesReportItem[1])">
                   {{ imageSalesReportItem[1].name || '' }}
                  </a>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6">
                  <a @click="downloadReport(imageSalesAllReport)">All Image Sales</a>
                </b-col>

              </b-row>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex"
import EventBus from "../../event-bus"
import {
  getReport,
} from '@/api'
import BarChart from "./BarChart.vue"

export default {
  name: "dashboard-manage-event-statistics",
  components: { BarChart },
  data() {
    return {
      sales: {},
      transactionReportType: 'transaction',
      imageSalesReportType: 'sales',
      chartOptions: {
        plugins: {
          customCanvasBackgroundColor: {
            color: 'white',
          }
        },
        responsive: true,
        scales: {
          yAxes: [{
            id: 'salesInItem',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Sales in unit'
            }
          }, {
            id: 'salesInMoney',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Total sales'
            }
          }]
        }
      },
      plugin: {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
          const {ctx} = chart;
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = options.color || '#99ffff';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      }
    }
  },
  computed: {
    ...mapGetters("Events", [
      "getEventContentSummary",
      "getEventStats",
      "getSelectedEvent",
    ]),
    stats() {
      return this.getEventStats
        ? this.getEventStats
        : { IMV: 0, EML: 0, IMD: 0, IMS: 0, SBR: 0 }
    },
    transactionHistoryChartData() {
      return !this.sales || !this.sales.transactionHistory
      ? {} 
      : {
        labels: this.sales.transactionHistory.labels,
        datasets: [ 
          { 
            type: 'bar', 
            data: this.sales.transactionHistory.singleCountArray,
            label: 'SINGLE SALES',
            yAxisID: 'salesInItem',
            backgroundColor: '#12a6de',
            stack: 'Stack 0',
          },
          { 
            type: 'bar', 
            data: this.sales.transactionHistory.batchCountArray,
            label: 'BATCH SALES',
            yAxisID: 'salesInItem',
            backgroundColor: '#ff4136',
            stack: 'Stack 0',
          },
          { 
            type: 'line',
            label: 'TOTAL SALES',
            borderColor: '#f8c555',
            yAxisID: 'salesInMoney',
            data: this.sales.transactionHistory.totalSalesArray,
          },
        ]
      }
    },
    transactionReportRows() {
      return this.getReportRows(true);
    },
    imageSalesReportRows() {
      return this.getReportRows(false);
    },
    transactionAllReport() {
      return {
        eventId: this.getSelectedEvent.event_id,
        reportType: this.transactionReportType,
        reportName: 'All'
      }
    },
    imageSalesAllReport() {
      return {
        eventId: this.getSelectedEvent.event_id,
        reportType: this.imageSalesReportType,
        reportName: 'All'
      }
    }
  },
  methods: {
    async downloadReport({ eventId, reportType, reportName }) {
      const res = await getReport(eventId, reportType, reportName);
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(res.data);
      link.download = `event#${eventId}-${reportType}-report-${reportName}.csv`;

      // Trigger the download by programmatically clicking the link
      link.click();

      // Clean up the temporary link object
      URL.revokeObjectURL(link.href);

    },
    getReportRows(isTransaction) {
      if (!this.sales) return []

      const reports = isTransaction 
          ? this.sales.transactionReports 
          : this.sales.imageSalesReports

      if (!reports) return []

      const reportType = isTransaction
        ? this.transactionReportType 
        : this.imageSalesReportType
      
      return reports.reduce((acc, curr, index) => {
        if (index % 2 === 0) {
          acc.push(
            index + 1 === reports.length
              ? [
                  {
                    name: curr,
                    eventId: this.getSelectedEvent.event_id,
                    reportType,
                    reportName: curr
                  }
                ]
              : [
                  {
                    name: curr,
                    eventId: this.getSelectedEvent.event_id,
                    reportType,
                    reportName: curr
                  },
                  {
                    name: reports[index + 1],
                    eventId: this.getSelectedEvent.event_id,
                    reportType,
                    reportName: reports[index + 1]
                  }
                ]
            )
        }
        return acc
      }, [])
    }
  },
  mounted() {
    this.$store.dispatch("Events/getSales", this.getSelectedEvent.event_id)
    EventBus.$on(
      "loadEvent(" + this.getSelectedEvent.event_id + ")Sales",
      payload => {
        this.sales = payload
      }
    )
  },
}
</script>

<style scoped>
.block {
  background: #fff;
  height: 5em;
  margin: 1em 0;
}

.orange {
  background: #fa8a5c;
}

.purple {
  background: #5c358f;
}

.pink {
  background: #f54972;
}

.fas {
  color: var(--main-theme);
  height: 100%;
  width: 100%;
  font-size: 3em;
}

.stats-number {
  color: #ccc;
  font-size: 25px;
  text-align: center;
  margin-bottom: 0;
  font-weight: bold;
}

.stats-name {
  font-size: 14px;
  color: #ccc;
  text-align: center;
  margin-bottom: 0;
  font-weight: bold;
  text-transform: uppercase;
}

.sub-reports-wrapper {
  padding: 0 15px 25px 15px;
}

.transaction-history-chart-wrapper {
  margin: 20px 0px;
}

.reports-wrapper a {
  color: #12a6de;
  text-decoration: underline;
  /* padding: 1em 0; */
  margin: 0 0px;
  cursor: pointer;
}

.reports-wrapper a:hover {
  color: #12a6de;
  text-decoration: underline;
  /* padding: 1em 0; */
  margin: 0 0px;
  cursor: pointer;
}

.reports-wrapper span.text {
  width: 100%;
  border-bottom: 1px solid black;
  padding-bottom: 5px;
  margin: 0 0px 10px 0px;
}

.reports-wrapper .col-6 {
  padding: 0;
}

@media only screen and (min-width: 992px) {
  .fas {
    font-size: 1.5em;
  }
  .stats-number {
    font-size: 21px;
  }
  .stats-name {
    font-size: 11px;
  }
  .text {
    color: #afb7c3;
  }

  .iconNormal{
    color: #9aa0aa;
    font-size: 20px;
    text-align: center;
    margin-bottom: 15px;
  }
}
</style>
