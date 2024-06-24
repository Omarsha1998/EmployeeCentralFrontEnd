<template>

  <!-- <q-table
    v-if="leaveView === true"
    :rows="items"
    :columns="columns"
    row-key="name"
    style="max-height: 450px"
    flat bordered
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-pagination
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot:body="{ row, name }">
      <q-tr :key="name">
        <q-td
          v-for="col in columns"
          :key="col.name"
          class="text-center"
          :style="{ width: col.width || 'auto' }"
        >
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card v-if="row.status === 'Approved'" class="action-card approved-card">
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card v-else-if="row.status === 'RejectedByLevel1' || row.status === 'RejectedByLevel2'" class="action-card rejected-card">
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>
          </template>
          <template v-else>
            {{ renderCell(row, col) }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table> -->

  <q-virtual-scroll
    v-if="leaveView === true"
    class="virtual-scroll"
    type="table"
    style="max-height: 450px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="items"
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name" class="text-center">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, name }">
      <q-tr :key="name">
        <q-td
          v-for="col in columns"
          :key="col.name"
          class="text-center"
          :style="{ width: col.width || 'auto' }"
        >
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card v-if="row.status === 'Approved'" class="action-card approved-card">
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card
              v-else-if="row.status === 'RejectedByLevel1' || row.status === 'RejectedByLevel2'"
              class="action-card rejected-card"
            >
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>
          </template>
          <template v-else>
            <!-- {{ renderCell(row, col) }} -->
            <renderCell :row="row" :col="col" :LeaveTypeLabels="LeaveTypeLabels"/>
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-virtual-scroll>

  <!-- <q-table
    v-if="cancelView === true"
    :rows="items"
    :columns="columns"
    row-key="name"
    style="max-height: 450px"
    flat bordered
    hide-pagination
    virtual-scroll
    :rows-per-page-options="[0]"
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot:body="{ row, name }">
      <q-tr :key="name">
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card v-if="row.cancelledStatusOrig === 'Approved'" class="action-card approved-card">
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card v-else-if="row.cancelledStatusOrig === 'RejectedByLevel1' || row.cancelledStatusOrig === 'RejectedByLevel2'" class="action-card rejected-card">
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>
          </template>
          <template v-else>
            {{ renderCell(row, col) }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table> -->

  <q-virtual-scroll
    v-if="cancelView === true"
    class="virtual-scroll"
    type="table"
    style="max-height: 450px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="items"
    >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, name }">
      <q-tr :key="name">
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">

            <q-card v-if="row.cancelledStatusOrig === 'Approved'">
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card v-else-if="row.cancelledStatusOrig === 'RejectedByLevel1' || row.cancelledStatusOrig === 'RejectedByLevel2'">
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>

          </template>
          <template v-else>
            <renderCell :row="row" :col="col" :LeaveTypeLabels="LeaveTypeLabels" :cancelView="true" />
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-virtual-scroll>
</template>

<script>
import renderCell from "../components/helpers/renderCell.vue"

export default {
  props: {
    items: Array,
    columns: Array,
    LeaveTypeLabels: Object,
    leaveView: Boolean,
    cancelView: Boolean,
  },

  components: {
    renderCell
  },

  methods: {
    
  }
}
</script>

<style>

.roundedd {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 560px;
}


.roundedd1 {
  border-radius: 10px;
  padding-bottom: 10px;

}



.containermainn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}


.q-date-container {
  position: relative;
}

.no-dropdown .q-btn-dropdown__arrow {
  display: none;
}


</style>
