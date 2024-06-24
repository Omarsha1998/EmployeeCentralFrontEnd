<template>
  <div>
    <q-layout>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <!-- Leave Request Form -->
            <div :class="$q.screen.gt.md ? 'col-4 q-pr-lg' : 'col-12'">
              <div>
                <q-card class="roundedd">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Request Form
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <q-card-section v-if="!loading">
                    <q-select
                      filled
                      v-model="LeaveType"
                      use-input
                      input-debounce="0"
                      label="Leave Type"
                      :options="LeaveTypes"
                      @filter="filterFn"
                      style="margin-bottom: 5px"
                      behavior="menu"
                      fill-input
                      hide-selected
                      class="bg-grey-3"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>

                    <!-- <q-select v-model="LeaveType" label="Leave Type" filled dense required :options="LeaveTypes" style="margin-bottom: 5px; " /> -->
                    <q-input
                      class="bg-grey-3"
                      filled
                      label="Days"
                      v-model="Days"
                      type="number"
                      min="0.5"
                      step="0.5"
                      style="margin-bottom: 5px"
                    />
                    <q-input
                      class="bg-grey-3"
                      filled
                      v-model="DateFrom"
                      label="Date From"
                      @change="updateDateTo"
                      @click="showPopup('dateFromPopup')"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="dateFromPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-date
                                v-model="DateFrom"
                                mask="MM/DD/YYYY"
                              ></q-date>
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('dateFromPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              ></q-btn>
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      class="bg-grey-3"
                      filled
                      v-model="DateTo"
                      label="Date To"
                      @change="updateDays"
                      @click="showPopup('dateToPopup')"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="dateToPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-date
                                v-model="DateTo"
                                mask="MM/DD/YYYY"
                              ></q-date>
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('dateToPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              ></q-btn>
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      class="bg-grey-3"
                      filled
                      label="Time From Half Day"
                      v-model="TimeFrom"
                      :disable="!isTimeEnabled"
                      @click="showPopup('TimeFromPopup')"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy
                            ref="TimeFromPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-time v-model="TimeFrom" mask="h:mm A"></q-time>
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('TimeFromPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              ></q-btn>
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      class="bg-grey-3"
                      filled
                      label="Time To Half Day"
                      v-model="TimeTo"
                      :disable="!isTimeEnabled"
                      @click="showPopup('TimeToPopup')"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy
                            ref="TimeToPopup"
                            :breakpoint="1440"
                            cover
                          >
                            <div class="q-date-container">
                              <q-time v-model="TimeTo" mask="h:mm A"></q-time>
                              <q-btn
                                push
                                icon="close"
                                @click="hidePopup('TimeToPopup')"
                                class="bg-white absolute-top-right"
                                round
                                padding="xs"
                                style="margin: 10px"
                              ></q-btn>
                            </div>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      filled
                      v-model="Reason"
                      label="Reason for Leave"
                      type="textarea"
                      class="q-mb-md bg-grey-3"
                      :rows="1"
                    />
                    <div class="text-center">
                      <q-btn
                        push
                        color="blue"
                        class="q-mt-xs text-white"
                        label="Submit Application"
                        @click="submitLeaveRequest"
                      />
                    </div>
                  </q-card-section>

                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-else>
                    <SkeletonLoader :formDetails="true" />
                    <!-- <template v-for="index in 7" :key="index">
                      <q-skeleton :style="{ height: '55px', marginBottom: '10px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                    </template>
                    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }" >
                      <q-skeleton :style="{ height: '35px', width: '170px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                    </div> -->
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Leave Details / Leave Balance -->
            <div :class="$q.screen.gt.md ? 'col-8' : 'col-12'">
              <q-card class="roundedd">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">Leave Details</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          v-model="searchTextBalance"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto' }"
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="3" />
                  </template>

                  <template v-else>
                    <!-- <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 480px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="sortedLeaveBalance"
                      >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th
                              v-for="col in balancecolumns"
                              :key="col.name"
                              :style="{ width: 'calc(100% / ' + balancecolumns.length + ')'}"
                              class="text-center"
                            >
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>

                      <template v-slot="{ item: row, year }">
                        <q-tr :key="year">
                          <q-td v-for="col in balancecolumns" :key="col.year" class="text-center" :style="{ width: col.width }">
                            {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll> -->
                    <viewDetails
                      :items="sortedLeaveBalance"
                      :columns="balancecolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :desktop="true"
                    />
                    <div
                      v-if="sortedLeaveBalance.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 30px" />
                      No data available
                    </div>
                    <div style="flex: 1"></div>
                    <q-card-section
                      v-if="sortedLeaveBalance.length > 0"
                      class="bg-blue-2 text-left"
                    >
                      <span class="text-italic"
                        >Total Vacation Leave Remaining:
                      </span>
                      <span class="text-bold">{{ totalVl }}</span>
                    </q-card-section>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Details
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :detailsSkel="true" />
                    <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 14" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '130px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                      </q-card>
                    </div> -->
                  </template>

                  <template v-else>
                    <q-input
                      class="col-12"
                      v-model="searchTextBalance"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :class="[$q.screen.name + '-text2']"
                      @clear="clearSearchText"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <!-- <q-table
                      v-if="sortedLeaveBalance.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedLeaveBalance"
                      :columns="balancecolumns"
                      row-key="year"
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card
                            bordered
                            flat
                            :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0
                            }"
                            >
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section >
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <q-item-label class="text-bold text-black" caption style="padding-top: 7px;" >
                                  {{ 
                                    col.field === 'leaveType'
                                      ? LeaveTypeLabels[props.row[col.field]]
                                      : props.row[col.field]
                                  }}
                                </q-item-label>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table> -->
                    <viewDetails
                      :items2="sortedLeaveBalance"
                      :columns2="balancecolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :tableMobile="true"
                    />
                    <template> </template>
                    <div
                      v-if="sortedLeaveBalance.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>

            <!-- Leave History -->
            <div class="col-12">
              <q-card
                v-show="showLeaveHistory"
                class="roundedd1"
                :class="`card-${$q.screen.name}`"
              >
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-forfeited-leaves="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-4 text-center">Leave History</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          style="font-size: 15px"
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto' }"
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="9" />
                  </template>
                  <template v-else>
                    <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="sortedLeaveDetails"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in leavecolumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>

                      <template v-slot="{ item: row, leaveId }">
                        <q-tr :key="leaveId">
                          <q-td
                            v-for="col in leavecolumns"
                            :key="col.leaveId"
                            class="text-center"
                            :style="{ width: col.width }"
                          >
                            {{ getFormattedCellValue(row, col) }}
                            <template v-if="col.label === 'Actions'">
                              <div
                                v-if="
                                  (row.approvedByLevel1 === 0 &&
                                    row.status === 'PendingLevel2' &&
                                    row.iDCode !== 'TempLeave') ||
                                  (row.status === 'Pending' &&
                                    row.iDCode !== 'TempLeave')
                                "
                              >
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown bg-grey-3"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="editLeave(row.leaveId)"
                                    >
                                      <q-item-section>
                                        <q-item-label>Edit Leave</q-item-label>
                                      </q-item-section>
                                    </q-item>
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="cancelLeave(row.leaveId)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Cancel Leave</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                              <div
                                v-else-if="
                                  (row.status === 'Approved' &&
                                    row.iDCode !== 'TempLeave') ||
                                  (row.approvedByLevel1 !== null &&
                                    row.status === 'PendingLevel2' &&
                                    row.iDCode !== 'TempLeave')
                                "
                              >
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown bg-grey-3"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="cancelLeave(row.leaveId)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Cancel Leave</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                              <div
                                v-if="
                                  row.status === 'RejectedByLevel1' ||
                                  row.status === 'RejectedByLevel2'
                                "
                              >
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold bg-grey-3">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="reason(row.reasonForRejection)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Reason of Rejection</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                              <div v-if="row.cancelledStatusOrig !== null">
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold bg-grey-3">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="reasonCancel(row.reasonForCancel)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Reason of Cancelation</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                            </template>
                            <template v-if="col.name === 'Reason'">
                              <q-btn
                                push
                                @click="reasonLeave(row.reasonForLeave)"
                                icon="article"
                                color="primary"
                                style="width: 50%"
                              />
                            </template>
                            <template v-if="col.name === 'Status'">
                              <template
                                v-if="
                                  row.status === 'Approved' ||
                                  row.status === 'RejectedByLevel1' ||
                                  row.status === 'RejectedByLevel2'
                                "
                              >
                                <template
                                  v-if="
                                    row.status === 'Approved' &&
                                    row.cancelledStatusOrig === null
                                  "
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-green-8 text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      LEAVE APPROVED
                                    </q-card-section>
                                  </q-card>
                                </template>
                                <template
                                  v-else-if="row.status === 'RejectedByLevel1'"
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-negative text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      REJECTED BY LEVEL 1
                                    </q-card-section>
                                  </q-card>
                                </template>
                                <template
                                  v-else-if="row.status === 'RejectedByLevel2'"
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-negative text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      REJECTED BY LEVEL 2
                                    </q-card-section>
                                  </q-card>
                                </template>
                              </template>
                              <template
                                v-else-if="
                                  (row.status === 'Pending' ||
                                    row.status === 'PendingLevel2') &&
                                  row.cancelledStatusOrig === null
                                "
                              >
                                <div
                                  style="
                                    display: block;
                                    justify-content: center;
                                  "
                                >
                                  <div
                                    class="q-pb-xs"
                                    v-if="
                                      approversDetails &&
                                      approversDetails.some(
                                        (item) => item.lvl === 1
                                      )
                                    "
                                  >
                                    <template
                                      v-if="row.status === 'PendingLevel2'"
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-green-8 text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          LEVEL 1 APPROVED
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                    <template
                                      v-else-if="row.status === 'Pending'"
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-yellow-10 text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          PENDING LEVEL 1
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                  </div>
                                  <div
                                    class="q-pb-xs"
                                    v-if="
                                      approversDetails &&
                                      approversDetails.some(
                                        (item) => item.lvl === 2
                                      )
                                    "
                                  >
                                    <template
                                      v-if="row.approvedByLevel2 === null"
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-yellow-10 text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          PENDING LEVEL 2
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                  </div>
                                </div>
                              </template>
                              <template
                                v-if="
                                  row.iDCode === 'TempLeave' &&
                                  row.status === 'CANCELLED'
                                "
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    CANCELED APPROVED
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template
                                v-if="
                                  row.cancelledStatusOrig === 'Approved' ||
                                  row.cancelledStatusOrig ===
                                    'RejectedByLevel1' ||
                                  row.cancelledStatusOrig === 'RejectedByLevel2'
                                "
                              >
                                <template
                                  v-if="
                                    (row.cancelledStatusOrig === 'Approved' &&
                                      row.approvedByLevel1 !== null &&
                                      row.approvedByLevel2 === null) ||
                                    (row.cancelledStatusOrig === 'Approved' &&
                                      row.approvedByLevel1 === null &&
                                      row.approvedByLevel2 === null)
                                  "
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-negative text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      CANCELED
                                    </q-card-section>
                                  </q-card>
                                </template>
                                <template
                                  v-if="
                                    row.cancelledStatusOrig === 'Approved' &&
                                    row.approvedByLevel1 !== null &&
                                    row.approvedByLevel2 !== null
                                  "
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-negative text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      CANCELED APPROVED
                                    </q-card-section>
                                  </q-card>
                                </template>
                                <template
                                  v-else-if="
                                    row.cancelledStatusOrig ===
                                    'RejectedByLevel1'
                                  "
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-negative text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      CANCEL REJECTED BY LEVEL 1
                                    </q-card-section>
                                  </q-card>
                                </template>
                                <template
                                  v-else-if="
                                    row.cancelledStatusOrig ===
                                    'RejectedByLevel2'
                                  "
                                >
                                  <q-card style="width: 100%">
                                    <q-card-section
                                      class="bg-negative text-white text-bold text-center"
                                      style="line-height: 25%"
                                    >
                                      CANCEL REJECTED BY LEVEL 2
                                    </q-card-section>
                                  </q-card>
                                </template>
                              </template>
                              <template
                                v-else-if="
                                  row.cancelledStatusOrig === 'Pending' ||
                                  row.cancelledStatusOrig === 'PendingLevel2'
                                "
                              >
                                <div
                                  style="
                                    display: block;
                                    justify-content: center;
                                  "
                                >
                                  <div
                                    class="q-pb-xs"
                                    v-if="
                                      approversDetails &&
                                      approversDetails.some(
                                        (item) => item.lvl === 1
                                      )
                                    "
                                  >
                                    <template
                                      v-if="
                                        row.cancelledStatusOrig ===
                                        'PendingLevel2'
                                      "
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-green-8 text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          LEVEL 1 CANCEL APPROVED
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                    <template
                                      v-else-if="
                                        row.cancelledStatusOrig === 'Pending'
                                      "
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-yellow-10 text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          PENDING CANCEL LEVEL 1
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                  </div>
                                  <div
                                    class="q-pb-xs"
                                    v-if="
                                      approversDetails &&
                                      approversDetails.some(
                                        (item) => item.lvl === 2
                                      )
                                    "
                                  >
                                    <template
                                      v-if="row.cancelledByLevel2 === null"
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-yellow-10 text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          PENDING CANCEL LEVEL 2
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                  </div>
                                </div>
                              </template>
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll>
                    <div
                      v-if="sortedLeaveDetails.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 30px" />
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave History
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true" />
                    <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 7" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div> -->
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-forfeited-leaves="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <q-table
                      v-if="sortedLeaveDetails.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedLeaveDetails"
                      :columns="leavecolumns"
                      row-key="leaveId"
                      hide-bottom
                      style="max-height: 450px; overflow-y: auto"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card
                            bordered
                            flat
                            :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0,
                            }"
                          >
                            <q-list dense>
                              <q-item
                                v-for="col in props.cols.filter(
                                  (col) => col.name !== 'desc'
                                )"
                                :key="col.name"
                              >
                                <q-item-section>
                                  <q-item-label>{{
                                    col.label + ":"
                                  }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.label === 'Actions'">
                                  <div
                                    class="q-pt-xs"
                                    v-if="
                                      (props.row.approvedByLevel1 === 0 &&
                                        props.row.status === 'PendingLevel2') ||
                                      props.row.status === 'Pending'
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown bg-grey-3"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold">
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="editLeave(props.row.leaveId)"
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Edit Leave</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="
                                            cancelLeave(props.row.leaveId)
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Cancel Leave</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                  <div
                                    class="q-pt-xs"
                                    v-else-if="
                                      props.row.status === 'Approved' ||
                                      (props.row.approvedByLevel1 !== null &&
                                        props.row.approvedByLevel2 === null)
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown bg-grey-3"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold">
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="
                                            cancelLeave(props.row.leaveId)
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Cancel Leave</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                  <div
                                    class="q-pt-xs"
                                    v-if="
                                      props.row.status === 'RejectedByLevel1' ||
                                      props.row.status === 'RejectedByLevel2'
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold bg-grey-3">
                                        <q-item
                                          class="hoverable-item"
                                          v-if="
                                            props.row.status ===
                                              'RejectedByLevel1' ||
                                            props.row.status ===
                                              'RejectedByLevel2'
                                          "
                                          clickable
                                          v-close-popup
                                          @click="
                                            reason(props.row.reasonForRejection)
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Reason of Rejection</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                  <div
                                    class="q-pt-xs"
                                    v-if="
                                      props.row.cancelledStatusOrig !== null
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold bg-grey-3">
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="
                                            reasonCancel(
                                              props.row.reasonForCancel
                                            )
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Reason of
                                              Cancellation</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                </template>
                                <template v-if="col.name === 'Status'">
                                  <template
                                    v-if="
                                      props.row.status === 'Approved' ||
                                      props.row.status === 'RejectedByLevel1' ||
                                      props.row.status === 'RejectedByLevel2'
                                    "
                                  >
                                    <div class="q-pt-xs">
                                      <template
                                        v-if="
                                          props.row.status === 'Approved' &&
                                          props.row.cancelledStatusOrig === null
                                        "
                                      >
                                        <q-card style="width: 100%">
                                          <q-card-section
                                            class="bg-green-8 text-white text-bold text-center"
                                            style="line-height: 25%"
                                          >
                                            LEAVE APPROVED
                                          </q-card-section>
                                        </q-card>
                                      </template>
                                      <template
                                        v-else-if="
                                          props.row.status ===
                                          'RejectedByLevel1'
                                        "
                                      >
                                        <q-card style="width: 100%">
                                          <q-card-section
                                            class="bg-negative text-white text-bold text-center"
                                            style="line-height: 25%"
                                          >
                                            REJECTED BY LEVEL 1
                                          </q-card-section>
                                        </q-card>
                                      </template>
                                      <template
                                        v-else-if="
                                          props.row.status ===
                                          'RejectedByLevel2'
                                        "
                                      >
                                        <q-card style="width: 100%">
                                          <q-card-section
                                            class="bg-negative text-white text-bold text-center"
                                            style="line-height: 25%"
                                          >
                                            REJECTED BY LEVEL 2
                                          </q-card-section>
                                        </q-card>
                                      </template>
                                    </div>
                                  </template>
                                  <template
                                    v-else-if="
                                      (props.row.status === 'Pending' ||
                                        props.row.status === 'PendingLevel2') &&
                                      props.row.cancelledStatusOrig === null
                                    "
                                  >
                                    <div
                                      style="
                                        display: block;
                                        justify-content: center;
                                      "
                                    >
                                      <div
                                        class="q-pb-xs"
                                        v-if="
                                          approversDetails &&
                                          approversDetails.some(
                                            (item) => item.lvl === 1
                                          )
                                        "
                                      >
                                        <template
                                          v-if="
                                            props.row.status === 'PendingLevel2'
                                          "
                                        >
                                          <q-card style="width: 100%">
                                            <q-card-section
                                              class="bg-green-8 text-white text-bold text-center"
                                              style="line-height: 25%"
                                            >
                                              LEVEL 1 APPROVED
                                            </q-card-section>
                                          </q-card>
                                        </template>
                                        <template
                                          v-else-if="
                                            props.row.status === 'Pending'
                                          "
                                        >
                                          <q-card style="width: 100%">
                                            <q-card-section
                                              class="bg-yellow-10 text-white text-bold text-center"
                                              style="line-height: 25%"
                                            >
                                              PENDING LEVEL 1
                                            </q-card-section>
                                          </q-card>
                                        </template>
                                      </div>
                                      <div
                                        class="q-pb-xs"
                                        v-if="
                                          approversDetails &&
                                          approversDetails.some(
                                            (item) => item.lvl === 2
                                          )
                                        "
                                      >
                                        <template
                                          v-if="
                                            props.row.approvedByLevel2 === null
                                          "
                                        >
                                          <q-card style="width: 100%">
                                            <q-card-section
                                              class="bg-yellow-10 text-white text-bold text-center"
                                              style="line-height: 25%"
                                            >
                                              PENDING LEVEL 2
                                            </q-card-section>
                                          </q-card>
                                        </template>
                                      </div>
                                    </div>
                                  </template>
                                  <template
                                    v-if="
                                      props.row.cancelledStatusOrig ===
                                        'Approved' ||
                                      props.row.cancelledStatusOrig ===
                                        'RejectedByLevel1' ||
                                      props.row.cancelledStatusOrig ===
                                        'RejectedByLevel2'
                                    "
                                  >
                                    <template
                                      v-if="
                                        props.row.cancelledStatusOrig ===
                                        'Approved'
                                      "
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-negative text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          CANCELED APPROVED
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                    <template
                                      v-else-if="
                                        props.row.cancelledStatusOrig ===
                                        'RejectedByLevel1'
                                      "
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-negative text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          CANCEL REJECTED BY LEVEL 1
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                    <template
                                      v-else-if="
                                        props.row.cancelledStatusOrig ===
                                        'RejectedByLevel2'
                                      "
                                    >
                                      <q-card style="width: 100%">
                                        <q-card-section
                                          class="bg-negative text-white text-bold text-center"
                                          style="line-height: 25%"
                                        >
                                          CANCEL REJECTED BY LEVEL 2
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                  </template>
                                  <template
                                    v-else-if="
                                      props.row.cancelledStatusOrig ===
                                        'Pending' ||
                                      props.row.cancelledStatusOrig ===
                                        'PendingLevel2'
                                    "
                                  >
                                    <div
                                      style="
                                        display: block;
                                        justify-content: center;
                                      "
                                    >
                                      <div
                                        class="q-pb-xs"
                                        v-if="
                                          approversDetails &&
                                          approversDetails.some(
                                            (item) => item.lvl === 1
                                          )
                                        "
                                      >
                                        <template
                                          v-if="
                                            props.row.cancelledStatusOrig ===
                                            'PendingLevel2'
                                          "
                                        >
                                          <q-card style="width: 100%">
                                            <q-card-section
                                              class="bg-green-8 text-white text-bold text-center"
                                              style="line-height: 25%"
                                            >
                                              LEVEL 1 CANCEL APPROVED
                                            </q-card-section>
                                          </q-card>
                                        </template>
                                        <template
                                          v-else-if="
                                            props.row.cancelledStatusOrig ===
                                            'Pending'
                                          "
                                        >
                                          <q-card style="width: 100%">
                                            <q-card-section
                                              class="bg-yellow-10 text-white text-bold text-center"
                                              style="line-height: 25%"
                                            >
                                              PENDING CANCEL LEVEL 1
                                            </q-card-section>
                                          </q-card>
                                        </template>
                                      </div>
                                      <div
                                        class="q-pb-xs"
                                        v-if="
                                          approversDetails &&
                                          approversDetails.some(
                                            (item) => item.lvl === 2
                                          )
                                        "
                                      >
                                        <template
                                          v-if="
                                            props.row.cancelledByLevel2 === null
                                          "
                                        >
                                          <q-card style="width: 100%">
                                            <q-card-section
                                              class="bg-yellow-10 text-white text-bold text-center"
                                              style="line-height: 25%"
                                            >
                                              PENDING CANCEL LEVEL 2
                                            </q-card-section>
                                          </q-card>
                                        </template>
                                      </div>
                                    </div>
                                  </template>
                                </template>
                                <template v-else>
                                  <q-item-label
                                    class="text-bold text-black"
                                    caption
                                    style="padding-top: 7px"
                                  >
                                    {{ getFormattedCellValue(props.row, col) }}
                                  </q-item-label>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div
                      v-if="sortedLeaveDetails.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>

            <!-- Forfeited Leaves -->
            <div class="col-12">
              <q-card v-show="!showLeaveHistory" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-forfeited-leaves="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-4 text-center">Forfeited Leaves</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          style="font-size: 15px"
                          v-model="searchTextForfeited"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto' }"
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="9" />
                  </template>

                  <template v-else>
                    <!-- <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="sortedForfeitedLeaves"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in forfeitedColumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>

                      <template v-slot="{ item: row, id }">
                        <q-tr :key="id">
                          <q-td v-for="col in forfeitedColumns" :key="col.id" class="text-center" :style="{ width: col.width }">
                            {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'transDate' ? formatDateTime(row[col.field]) : row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll> -->
                    <viewDetails
                      :items="sortedForfeitedLeaves"
                      :columns="forfeitedColumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :desktop="true"
                    />
                    <div
                      v-if="sortedForfeitedLeaves.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 30px" />
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Forfeited Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true" />
                    <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 7" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div> -->
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-forfeited-leaves="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <!-- <q-table
                      v-if="sortedForfeitedLeaves.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedForfeitedLeaves"
                      :columns="forfeitedColumns"
                      row-key="id"
                      hide-bottom
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card
                            bordered
                            flat
                            :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0
                            }"
                          >
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <q-item-label class="text-bold text-black" caption style="padding-top: 7px;" >
                                  {{ 
                                    col.field === 'transDate'
                                      ? formatDateTime(props.row[col.field])
                                      : col.field === 'leaveType'
                                      ? LeaveTypeLabels[props.row[col.field]]
                                      : props.row[col.field]
                                  }}
                                </q-item-label>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table> -->
                    <viewDetails
                      :items="sortedForfeitedLeaves"
                      :columns="forfeitedColumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :tableMobile2="true"
                    />
                    <div
                      v-if="sortedForfeitedLeaves.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>
          </div>
        </div>

        <!-- dialong for cancelation -->
        <q-dialog v-model="cancelDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-sm">
              <div class="text-white text-bold">Reason For Canceling Leave</div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                padding="xs"
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section class="q-pt-xm">
              <q-input
                filled
                v-model="reasonForCancelation"
                placeholder="Type here"
                type="textarea"
              ></q-input>
            </q-card-section>
            <q-card-actions
              style="display: flex; justify-content: right"
              class="q-pr-md"
            >
              <div style="display: flex; justify-content: center; gap: 10px">
                <q-btn
                  class="bg-negative text-white text-subtitle1"
                  push
                  label="cancel"
                  @click="cancelCancelation"
                />
                <q-btn
                  class="bg-primary text-white text-subtitle1"
                  push
                  label="confirm"
                  @click="confirmCancel"
                />
              </div>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Approver Dialog -->
        <q-dialog v-model="approverDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-md">
              <div class="bg-primary text-white text-bold">
                Approvers by Level
              </div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-subtitle1">
              <q-table
                flat
                bordered
                :rows="sortedApproversDetails"
                :columns="approversCol"
                row-key="Level"
                hide-bottom
                style="max-height: 400px; overflow-y: auto"
                class="virtual-scroll"
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
              >
              </q-table>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Reason Dialog -->
        <q-dialog v-model="reasonDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-md">
              <div class="text-white">Reason for Rejection</div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>

            <q-card-section class="text-subtitle2">
              {{ this.reasonForRejection }}
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- reason for cancel dialong -->
        <q-dialog v-model="reasonDialogCancel">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-md">
              <div class="text-h6 text-white">Reason for Cancellation</div>
              <q-space></q-space>
              <q-btn
                class="bg-grey-3"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>

            <q-card-section class="text-subtitle2">
              {{ this.reasonForCancelation }}
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Edit / Delete Dialog -->
        <q-dialog v-model="editDialog" @hide="resetForm">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section
              rd-section
              class="bg-primary text-white text-center"
              horizontal:class="['bold-text', $q.screen.name + '-text']"
            >
              Edit Leave Form
            </q-card-section>
            <q-card-section>
              <q-select
                filled
                v-model="LeaveType2"
                use-input
                input-debounce="0"
                label="Leave Type"
                :options="LeaveTypes"
                @filter="filterFn"
                style="margin-bottom: 5px"
                behavior="menu"
                fill-input
                hide-selected
                class="bg-grey-3"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input
                class="bg-grey-3"
                filled
                label="Days"
                v-model="Days2"
                type="number"
                min="0.5"
                step="0.5"
                @input="updateDateTo"
              />
              <q-input
                class="bg-grey-3"
                filled
                v-model="DateFrom2"
                label="Date From"
                @change="updateDateTo"
                @click="showPopup('dateFromPopup2')"
                style="margin-bottom: 5px"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="dateFromPopup2"
                      :breakpoint="1440"
                      cover
                    >
                      <div class="q-date-container">
                        <q-date v-model="DateFrom2" mask="MM/DD/YYYY"></q-date>
                        <q-btn
                          push
                          icon="close"
                          @click="hidePopup('dateFromPopup2')"
                          class="bg-white absolute-top-right"
                          round
                          padding="xs"
                          style="margin: 10px"
                        ></q-btn>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                class="bg-grey-3"
                filled
                v-model="DateTo2"
                label="Date To"
                @change="updateDays"
                @click="showPopup('dateToPopup2')"
                style="margin-bottom: 5px"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="dateToPopup2" :breakpoint="1440" cover>
                      <div class="q-date-container">
                        <q-date v-model="DateTo2" mask="MM/DD/YYYY"></q-date>
                        <q-btn
                          push
                          icon="close"
                          @click="hidePopup('dateToPopup2')"
                          class="bg-white absolute-top-right"
                          round
                          padding="xs"
                          style="margin: 10px"
                        ></q-btn>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                class="bg-grey-3"
                filled
                label="Time From Half Day"
                v-model="TimeFrom2"
                :disable="!isTimeEnabled"
                @click="showPopup('TimeFromPopup2')"
                style="margin-bottom: 5px"
              >
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer">
                    <q-popup-proxy
                      ref="TimeFromPopup2"
                      :breakpoint="1440"
                      cover
                    >
                      <div class="q-date-container">
                        <q-time v-model="TimeFrom2" mask="h:mm A"></q-time>
                        <q-btn
                          push
                          icon="close"
                          @click="hidePopup('TimeFromPopup2')"
                          class="bg-white absolute-top-right"
                          round
                          padding="xs"
                          style="margin: 10px"
                        ></q-btn>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                class="bg-grey-3"
                filled
                label="Time To Half Day"
                v-model="TimeTo2"
                :disable="!isTimeEnabled"
                @click="showPopup('TimeToPopup2')"
                style="margin-bottom: 5px"
              >
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer">
                    <q-popup-proxy ref="TimeToPopup2" :breakpoint="1440" cover>
                      <div class="q-date-container">
                        <q-time v-model="TimeTo2" mask="h:mm A"></q-time>
                        <q-btn
                          push
                          icon="close"
                          @click="hidePopup('TimeToPopup2')"
                          class="bg-white absolute-top-right"
                          round
                          padding="xs"
                          style="margin: 10px"
                        ></q-btn>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <!-- <q-select v-model="LeaveType2" label="Leave Type" filled dense required :options="LeaveTypes" /> -->
              <q-input
                filled
                v-model="Reason2"
                label="Reason for Leave"
                type="textarea"
                class="q-mb-md bg-grey-3"
                :rows="1"
              />
              <div style="display: flex; justify-content: right; gap: 5px">
                <q-btn
                  push
                  color="red"
                  class="q-ml-xs text-subtitle1"
                  @click="cancelEdit"
                  label="Cancel"
                />
                <q-btn
                  push
                  color="primary"
                  class="q-mr-xs text-subtitle1"
                  @click="updateLeave"
                  label="Submit"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <q-dialog v-model="reasonDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-sm">
              <div class="text-h6 text-white text-bold">
                Leave Request Reason
              </div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                padding="xs"
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section class="q-pt-xm text-justify text-subtitle1">
              {{ reasonForLeave }}
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { QSpinnerIos } from "quasar";
import helperMethods from "../helperMethods.js";
import DropdownMenu from "../components/DropdownMenuLeaveDetails.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import viewDetails from "../components/viewDetails.vue";
import { mapGetters } from "vuex";

let LeaveTypesOptions = [];

const originalOptions = [
  { label: "Google", value: "GL" },
  { label: "Facebook", value: "FB" },
  { label: "Twitter", value: "TW" },
  { label: "Apple", value: "AP" },
  { label: "Oracle", value: "OR" },
];

export default {
  data() {
    return {
      totalVl: "",
      searchTextDetails: "",
      searchTextForfeited: "",
      searchTextBalance: "",
      skeletonAnimations: ["wave", "fade", "fade", "none"],
      approverDialog: false,
      showLeaveHistory: true,
      loadingCounter: null,
      loading: true,
      updateDateToTriggered: false,
      Days: null,
      TimeFrom: null,
      TimeTo: null,
      DateFrom: null,
      DateTo: null,
      LeaveType: null,
      Reason: null,
      Days2: null,
      TimeFrom2: null,
      TimeTo2: null,
      DateFrom2: null,
      DateTo2: null,
      LeaveType2: null,
      Reason2: null,
      reasonForCancelation: "",
      cancelId: "",
      cancelDialog: false,
      approversDetails: [],
      approversCol: [
        { name: "Level", label: "Level", align: "center", field: "Level" },
        {
          name: "Employee Name",
          label: "Employee Name",
          align: "center",
          field: "EmployeeName",
          width: "130px",
        },
      ],
      LeaveTypes: LeaveTypesOptions,
      LeaveDetails: [],
      leavecolumns: [
        {
          name: "",
          label: "Actions",
          align: "center",
          field: "action",
          width: "8px",
        },
        {
          name: "Created",
          label: "Created",
          align: "center",
          field: "transDate",
          width: "130px",
        },
        {
          name: "Days",
          label: "Days",
          align: "center",
          field: "daysOfLeave",
          sortable: false,
          width: "90px",
        },
        {
          name: "Time From",
          label: "Time From",
          align: "center",
          field: "timeFrom",
          sortable: false,
          width: "118px",
        },
        {
          name: "Time To",
          label: "Time To",
          align: "center",
          field: "timeTo",
          sortable: false,
          width: "118px",
        },
        {
          name: "Date From",
          label: "Date From",
          align: "center",
          field: "dateLeavedFrom",
          sortable: false,
          width: "138px",
        },
        {
          name: "Date To",
          label: "Date To",
          align: "center",
          field: "dateLeavedTo",
          sortable: false,
          width: "138px",
        },
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "150px",
        },
        {
          name: "Reason",
          label: "Reason",
          align: "left",
          sortable: false,
          width: "80px",
        },
        {
          name: "Status",
          label: "Status",
          align: "center",
          field: "Status",
          sortable: false,
          width: "110px",
        },
      ],
      editDialog: false,
      editLeaveID: null,
      leaveBalance: [],
      balancecolumns: [
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
        },
        {
          name: "Year",
          label: "Year",
          align: "center",
          field: "year",
          sortable: false,
        },
        {
          name: "Balance",
          label: "Balance",
          align: "center",
          field: "remaining",
          sortable: false,
        },
      ],
      ForfeitedLeaves: [],
      forfeitedColumns: [
        {
          name: "ID",
          label: "ID",
          align: "center",
          field: "id",
          sortable: false,
        },
        {
          name: "Remarks",
          label: "Remarks",
          align: "center",
          field: "remarks",
          sortable: false,
        },
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
        },
        {
          name: "Value / Days",
          label: "Value / Days",
          align: "center",
          field: "credit",
          sortable: false,
        },
        {
          name: "Year Effectivity",
          label: "Year Effectivity",
          align: "center",
          field: "yearEffectivity",
          sortable: false,
        },
        {
          name: "Year Attributed",
          label: "Year Attributed",
          align: "center",
          field: "yearAttributed",
          sortable: false,
        },
        {
          name: "Transaction Date",
          label: "Transaction Date",
          align: "center",
          field: "transDate",
          sortable: false,
        },
      ],
      reasonDialog: false,
      reasonForRejection: "",
      reasonDialogCancel: false,
      daysExceedsBalance: false,
      model: null,
      options: originalOptions,
      reasonDialog: false,
      reasonForLeave: "",
    };
  },

  components: {
    DropdownMenu,
    SkeletonLoader,
    viewDetails,
  },

  computed: {
    ...mapGetters({
      leaveTypes: "leaveModule/leaveTypes",
      leaveDetails: "leaveModule/leaveDetails",
      appDetails: "leaveModule/approversDetails",
      leaveBal: "leaveModule/balanceDetails",
      forfeitedLeave: "leaveModule/ForfeitedDetails",
    }),

    isTimeEnabled() {
      return this.Days % 1 !== 0 || this.Days2 % 1 !== 0;
    },

    sortedApproversDetails() {
      if (!this.approversDetails || this.approversDetails.length === 0) {
        return [];
      }

      return this.approversDetails.map((row) => ({
        ...row,
        EmployeeName: `${row.lastName}, ${row.firstName} ${row.middleInitial}. `,
        Level: `${row.lvl}`,
      }));
    },

    sortedLeaveBalance() {
      if (!Array.isArray(this.leaveBalance)) {
        return [];
      }

      const query = this.searchTextBalance.toLowerCase();

      const sortedBalances = this.leaveBalance
        .filter(
          (row) =>
            row.year.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
        )
        .sort((a, b) => {
          const leaveTypeOrder = { VL: 1, SL: 2 };
          // Get the order of leave types
          const orderA = leaveTypeOrder[a.leaveType] || 3;
          const orderB = leaveTypeOrder[b.leaveType] || 3;
          if (orderA === orderB) {
            return b.year - a.year;
          }
          return orderA - orderB;
        });

      return sortedBalances.map((row) => ({
        ...row,
        remaining: Number.isInteger(row.remaining)
          ? row.remaining
          : row.remaining.toFixed(2),
      }));
    },

    sortedLeaveDetails() {
      if (Array.isArray(this.LeaveDetails)) {
        const query = this.searchTextDetails.toLowerCase();
        return this.LeaveDetails.filter((row) => {
          return (
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.formatDateTime(row.transDate).toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
          );
        })
          .map((row) => ({
            ...row,
            transDate: row.transDate.split("T")[0].replace(/-/g, "/"),
          }))
          .sort((a, b) => b.transDate - a.transDate);
      } else {
        return [];
      }
    },

    sortedForfeitedLeaves() {
      if (Array.isArray(this.ForfeitedLeaves)) {
        const query = this.searchTextForfeited.toLowerCase();

        return this.ForfeitedLeaves.filter((row) => {
          return (
            row.id.toString().toLowerCase().includes(query) || // Search by ID
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query) ||
            this.formatDateTime(row.transDate).toLowerCase().includes(query) ||
            row.remarks.toLowerCase().includes(query)
          );
        }).sort((a, b) => b.id - a.id);
      } else {
        return [];
      }
    },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },
  },

  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.LeaveTypes = LeaveTypesOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.LeaveTypes = LeaveTypesOptions.filter(
          (option) => option.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    // onItemClick(selectedItem) {
    //   if (selectedItem === 'SHOW_LEAVE_HISTORY') {
    //     this.showLeaveHistory = true;
    //   } else if (selectedItem === 'SHOW_FORFEITED_LEAVE'){
    //     this.showLeaveHistory = false;
    //   } else if(selectedItem === 'SHOW_LEAVE_APPROVERS') {
    //     this.approverDialog = true;
    //   } else {
    //     this.showLeaveHistory = false;
    //   }
    // },

    cancelLeave(leaveId) {
      this.cancelDialog = true;
      this.cancelId = leaveId;
    },

    cancelCancelation() {
      this.reasonForRejection = "";
      this.cancelDialog = false;
      this.cancelId = "";
    },

    reasonLeave(reasonForLeave) {
      this.reasonDialog = true;
      this.reasonForLeave = reasonForLeave;
    },

    clearSearchText() {
      this.searchTextDetails = "";
      this.searchTextForfeited = "";
      this.searchTextBalance = "";
    },

    reason(reasonForRejection) {
      this.reasonDialog = true;
      this.reasonForRejection = reasonForRejection;
    },

    reasonCancel(reasonForCancel) {
      this.reasonDialogCancel = true;
      this.reasonForCancelation = reasonForCancel;
    },

    showPopup(refName) {
      this.$refs[refName].show();
    },

    hidePopup(refName) {
      this.$refs[refName].hide();
    },

    async submitLeaveRequest() {
      
      if (
        (!Number.isInteger(this.Days) && this.Days % 0.5 !== 0) ||
        this.Days === "0"
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Days must be a whole number or a number with decimal places of 0.5",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        !this.Days ||
        !this.DateFrom ||
        !this.DateTo ||
        !this.LeaveType ||
        !this.Reason
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input the Required Field",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      console.log(this.isTimeEnabled, this.TimeFrom, this.TimeTo)

      if (
          (this.isTimeEnabled && (this.TimeFrom === null || this.TimeTo === null)) ||
          (this.isTimeEnabled && (this.TimeFrom === '' || this.TimeTo === ''))
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input a time for Half-Day",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        this.LeaveType.value === "EL" ||
        this.LeaveType.value === "SL" ||
        this.LeaveType.value === "ML" ||
        this.LeaveType.value === "MC"
      ) {
        const documentationMessage = this.getDocumentationMessage(
          this.LeaveType.value
        );

        this.$q
          .dialog({
            title: "Documentation",
            message: documentationMessage,
            cancel: true,
            persistent: true,
            ok: {
              push: true,
              color: "primary",
              label: "Confirm",
              class: "text-subtitle1",
            },
            cancel: {
              push: true,
              color: "negative",
              label: "Cancel",
              class: "text-subtitle1",
            },
          })
          .onOk(async () => {
            const leaveRequestData = {
              Days: this.Days,
              TimeFrom: this.TimeFrom,
              TimeTo: this.TimeTo,
              DateFrom: this.DateFrom,
              DateTo: this.DateTo,
              LeaveType: this.LeaveType.value,
              Reason: this.Reason,
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Submitting Leave Request",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });

            try {
              await helperMethods.delay(1500);
              await this.$store.dispatch(
                "leaveModule/submitLeaveRequest",
                leaveRequestData
              );
              await this.fetchLeaves();
              this.$q.loading.hide();
              this.$q.notify({
                color: "green-8",
                position: "center",
                message: "Success Leave Request, Wait For The Approval",
                icon: "check",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              helperMethods.disablePointerEvents(2000);
              this.Days = null;
              this.TimeFrom = null;
              this.TimeTo = null;
              this.DateFrom = null;
              this.DateTo = null;
              this.LeaveType = null;
              this.Reason = null;
            } catch (error) {
              this.$q.loading.hide();
              if (error.response.status) {
                this.$q.notify({
                  color: "negative",
                  position: "center",
                  message: `Error Leave Request / ${error.response.data.error}`,
                  icon: "report_problem",
                  iconColor: "white",
                  timeout: 1000,
                  progress: true,
                });
                return;
              }

              this.$q.notify({
                color: "negative",
                position: "center",
                message:
                  "Error Leave Request / Insufficient Balance, Check Your Balance",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            }
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      } else {
        this.$q
          .dialog({
            title: "Confirmation",
            message: "Are you sure you want to request leave?",
            cancel: true,
            persistent: true,
            ok: {
              push: true,
              color: "primary",
              label: "Confirm",
              class: "text-subtitle1",
            },
            cancel: {
              push: true,
              color: "negative",
              label: "Cancel",
              class: "text-subtitle1",
            },
          })
          .onOk(async () => {
            const leaveRequestData = {
              Days: this.Days,
              TimeFrom: this.TimeFrom,
              TimeTo: this.TimeTo,
              DateFrom: this.DateFrom,
              DateTo: this.DateTo,
              LeaveType: this.LeaveType.value,
              Reason: this.Reason,
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Submitting Leave Request",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });

            try {
              await helperMethods.delay(1500);
              await this.$store.dispatch(
                "leaveModule/submitLeaveRequest",
                leaveRequestData
              );
              await this.fetchLeaves();
              this.$q.loading.hide();
              this.$q.notify({
                color: "green-8",
                position: "center",
                message: "Success Leave Request, Wait For The Approval",
                icon: "check",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
              helperMethods.disablePointerEvents(2000);
              this.Days = null;
              this.TimeFrom = null;
              this.TimeTo = null;
              this.DateFrom = null;
              this.DateTo = null;
              this.LeaveType = null;
              this.Reason = null;
            } catch (error) {
              this.$q.loading.hide();
              if (error.response.status) {
                this.$q.notify({
                  color: "negative",
                  position: "center",
                  message: `Error Leave Request / ${error.response.data.error}`,
                  icon: "report_problem",
                  iconColor: "white",
                  timeout: 1000,
                  progress: true,
                });
                return;
              }

              this.$q.notify({
                color: "negative",
                position: "center",
                message:
                  "Error Leave Request / Insufficient Balance, Check Your Balance",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            }
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      }
    },

    async confirmCancel() {
      if (this.reasonForCancelation.length === 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input the Required Field (Reason)",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      this.$q
        .dialog({
          title: "Warning",
          message: "Are you sure you want to cancel your leave?",
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          const cancelData = {
            LeaveID: this.cancelId,
            reason: this.reasonForCancelation,
          };
          this.cancelDialog = false;
          this.reasonDialogCancel = false;

          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Cancelling Leave Request",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            await helperMethods.delay(1500);
            await this.$store.dispatch("leaveModule/cancelLeave", cancelData);
            this.cancelId = "";
            await this.fetchLeaves();
            this.$q.loading.hide();
            this.cancelDialog = false;
            this.reasonForCancelation = "";
            this.cancelId = "";
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: "Success Cancel of Leave Request, Wait For The Approval",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            helperMethods.disablePointerEvents(2000);
          } catch (error) {
            this.cancelId = "";
            this.$q.loading.hide();
            this.reasonForCancelation = "";
            this.cancelDialog = false;
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error cancel of leave request",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    getDocumentationMessage(leaveType) {
      switch (leaveType) {
        case "EL":
          return "Please Provide your Emergency Letter Document to HR or Head Department";
        case "SL":
          return "Please Provide your Health/Medical Certificate to HR or Head Department";
        case "ML":
        case "MC":
          return "Please Provide your Health/Medical Certificate to HR or Head Department";
        default:
          return "";
      }
    },

    async deleteLeave(leaveId) {
      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Canceling Leave Request",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });

      try {
        await helperMethods.delay(1500);
        await this.$store.dispatch("leaveModule/deleteLeaves", leaveId);
        await this.fetchLeaves();
        this.$q.loading.hide();
        helperMethods.disablePointerEvents(2000);
        this.$q.notify({
          color: "green-8",
          position: "center",
          message: "Success Canceling Leave Request",
          icon: "check",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      } catch (error) {
        console.error("Error Canceling Leave");
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Error Canceling Leave Request",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      }
    },

    editLeave(leaveId) {
      this.editDialog = true;
      this.editLeaveID = leaveId;
    },

    cancelEdit() {
      this.editDialog = false;
      this.editLeaveID = null;
      this.Days2 = null;
      this.TimeFrom2 = null;
      this.TimeTo2 = null;
      this.DateFrom2 = null;
      this.DateTo2 = null;
      this.LeaveType2 = null;
      this.Reason2 = null;
    },

    resetForm() {
      this.Days2 = null;
      this.DateFrom2 = null;
      this.DateTo2 = null;
      this.TimeFrom2 = null;
      this.TimeTo2 = null;
      this.LeaveType2 = null;
      this.Reason2 = null;
    },

    async updateLeave() {
      if (
        !this.Days2 ||
        !this.DateFrom2 ||
        !this.DateTo2 ||
        !this.LeaveType2 ||
        !this.Reason2
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input the Required Field",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (!Number.isInteger(this.Days2) && this.Days2 % 0.5 !== 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message:
            "Days must be a whole number or a number with decimal places of 0.5",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        this.isTimeEnabled &&
        this.TimeFrom2 === null &&
        this.TimeTo2 === null
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input a time for Half-Day",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      if (
        this.LeaveType2.value === "EL" ||
        this.LeaveType2.value === "SL" ||
        this.LeaveType2.value === "ML" ||
        this.LeaveType2.value === "MC"
      ) {
        const documentationMessage = this.getDocumentationMessage(
          this.LeaveType2.value
        );
        this.$q
          .dialog({
            title: "Documentation",
            message: documentationMessage,
            cancel: true,
            persistent: true,
            ok: {
              push: true,
              color: "primary",
              label: "Confirm",
              class: "text-subtitle1",
            },
            cancel: {
              push: true,
              color: "negative",
              label: "Cancel",
              class: "text-subtitle1",
            },
          })
          .onOk(async () => {
            const updatedLeave = {
              Days: this.Days2,
              TimeFrom: this.TimeFrom2,
              TimeTo: this.TimeTo2,
              DateFrom: this.DateFrom2,
              DateTo: this.DateTo2,
              LeaveType: this.LeaveType2.value,
              Reason: this.Reason2,
              editLeaveID: this.editLeaveID,
            };

            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Updating Leave Request",
              messageColor: "primary",
              backgroundColor: "blue-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            try {
              this.editDialog = false;
              await helperMethods.delay(1500);
              await this.$store.dispatch(
                "leaveModule/updateLeaves",
                updatedLeave
              );
              await this.fetchLeaves();
              this.$q.loading.hide();
              this.Days2 = null;
              this.TimeFrom2 = null;
              this.TimeTo2 = null;
              this.DateFrom2 = null;
              this.DateTo2 = null;
              this.LeaveType2 = null;
              this.Reason2 = null;
              helperMethods.disablePointerEvents(2000);
              this.$q.notify({
                color: "green-8",
                position: "center",
                message: "Success Editing Leave Request",
                icon: "check",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            } catch (error) {
              console.error("Error Updating Leave");
              this.$q.loading.hide();
              if (error.response.status) {
                this.$q.notify({
                  color: "negative",
                  position: "center",
                  message: `Error Updating Leave Request / ${error.response.data.error}`,
                  icon: "report_problem",
                  iconColor: "white",
                  timeout: 1000,
                  progress: true,
                });
                return;
              }
              this.$q.notify({
                color: "negative",
                position: "center",
                message:
                  "Error Editing / Updating Leave Request, Check the Balance of the Leave Type",
                icon: "report_problem",
                iconColor: "white",
                timeout: 1000,
                progress: true,
              });
            }
          })
          .onDismiss(() => {});
      } else {
        const updatedLeave = {
          Days: this.Days2,
          TimeFrom: this.TimeFrom2,
          TimeTo: this.TimeTo2,
          DateFrom: this.DateFrom2,
          DateTo: this.DateTo2,
          LeaveType: this.LeaveType2.value,
          Reason: this.Reason2,
          editLeaveID: this.editLeaveID,
        };

        try {
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Updating Leave Request",
            messageColor: "primary",
            backgroundColor: "blue-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });
          this.editDialog = false;
          await helperMethods.delay(1500);
          await this.$store.dispatch("leaveModule/updateLeaves", updatedLeave);
          await this.fetchLeaves();
          this.$q.loading.hide();
          this.Days2 = null;
          this.TimeFrom2 = null;
          this.TimeTo2 = null;
          this.DateFrom2 = null;
          this.DateTo2 = null;
          this.LeaveType2 = null;
          this.Reason2 = null;
          helperMethods.disablePointerEvents(2000);
          this.$q.notify({
            color: "green-8",
            position: "center",
            message: "Success Editing Leave Request",
            icon: "check",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
        } catch (error) {
          console.error("Error Updating Leave");
          this.Days2 = null;
          this.TimeFrom2 = null;
          this.TimeTo2 = null;
          this.DateFrom2 = null;
          this.DateTo2 = null;
          this.LeaveType2 = null;
          this.Reason2 = null;
          this.$q.loading.hide();
          if (error.response.status) {
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `Error Updating Leave Request / ${error.response.data.error}`,
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            return;
          }
          this.$q.notify({
            color: "negative",
            position: "center",
            message:
              "Error Editing / Updating Leave Request, Check the Balance of the Leave Type",
            icon: "report_problem",
            iconColor: "white",
            timeout: 1000,
            progress: true,
          });
        }
      }
    },

    async fetchLeaves() {
      await helperMethods.delay(1500);
      try {
        await this.$store.dispatch("leaveModule/fetchLeaves");
        this.LeaveDetails = this.leaveDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed getting Leave Details");
      }
    },

    async fetchApprovers() {
      await helperMethods.delay(1500);
      try {
        await this.$store.dispatch("leaveModule/fetchApprovers");
        this.approversDetails = this.appDetails;
      } catch (error) {
        console.error("Faile getting approvers details");
      }
    },

    async fetchleaveBalance() {
      try {
        await this.$store.dispatch("leaveModule/fetchleaveBalances");
        this.leaveBalance = this.leaveBal;
        let sumVL = 0;
        for (const balance of this.leaveBalance) {
          if (balance.leaveType === "VL") {
            sumVL += balance.remaining;
          }
        }
        this.totalVl = sumVL;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed Getting User Leave Balance");
      }
    },

    async fetchForfeitedLeaves() {
      try {
        await this.$store.dispatch("leaveModule/fetchForfeitedLeaves");
        this.ForfeitedLeaves = this.forfeitedLeave;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get the Forfeited Leaves");
      }
    },

    async fetchLeaveTypes() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaveTypes");
        LeaveTypesOptions = this.leaveTypes;
      } catch (error) {
        console.error("Failed to get the leave types");
      }
    },

    updateDays() {
      const updateDays = (DateFrom, DateTo, currentDays) => {
        const fromDate = new Date(DateFrom);
        const toDate = new Date(DateTo);

        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          const millisecondsInDay = 24 * 60 * 60 * 1000;
          const daysDifference = (toDate - fromDate) / millisecondsInDay;

          if (daysDifference >= 0) {
            currentDays = Number.isInteger(daysDifference)
              ? daysDifference + 1
              : daysDifference + (daysDifference % 1 === 0.5 ? -0.5 : 0.5);
          }
        }

        return currentDays;
      };

      if (this.DateFrom && this.DateTo) {
        if (this.updateDateToTriggered) {
          this.updateDateToTriggered = false;
          return;
        }

        this.Days = updateDays(this.DateFrom, this.DateTo, this.Days);
      }

      if (this.DateFrom2 && this.DateTo2) {
        if (this.updateDateToTriggered) {
          this.updateDateToTriggered = false;
          return;
        }

        this.Days2 = updateDays(this.DateFrom2, this.DateTo2, this.Days2);
      }
    },

    updateDateTo() {
      const updateDates = (DateFrom, days, DateTo) => {
        const fromDate = new Date(DateFrom);

        if (!isNaN(fromDate.getTime()) && days >= 0) {
          let totalMilliseconds;

          if (Number.isInteger(days)) {
            totalMilliseconds = (days - 1) * (24 * 60 * 60 * 1000);
          } else {
            totalMilliseconds = (days - 0.5) * (24 * 60 * 60 * 1000);
          }

          const toDate = new Date(fromDate.getTime() + totalMilliseconds);
          DateTo = this.formatDateTime(toDate);
        }

        return DateTo;
      };

      if (this.DateFrom && this.Days) {
        this.updateDateToTriggered = true;
        this.DateTo = updateDates(this.DateFrom, this.Days, this.DateTo);
      }

      if (this.DateFrom2 && this.Days2) {
        this.updateDateToTriggered = true;
        this.DateTo2 = updateDates(this.DateFrom2, this.Days2, this.DateTo2);
      }
    },

    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    formatTimeTo12Hours(Time) {
      return Time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },

    getFormattedCellValue(row, col) {
      if (col.field === "leaveType") {
        return this.LeaveTypeLabels[row[col.field]];
      } else if (
        col.field === "dateLeavedFrom" ||
        col.field === "dateLeavedTo" ||
        col.field === "transDate"
      ) {
        return this.formatDateTime(row[col.field]);
      } else {
        return row[col.field];
      }
    },
  },

  watch: {
    DateFrom: "updateDateTo",
    DateTo: "updateDays",
    Days: "updateDateTo",
    DateFrom2: "updateDateTo",
    DateTo2: "updateDays",
    Days2: "updateDateTo",
  },

  created() {
    this.fetchLeaves();
    this.fetchleaveBalance();
    this.fetchForfeitedLeaves();
    this.fetchApprovers();
    this.fetchLeaveTypes();
  },
};
</script>

<style>
.roundedd {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 580px;
  display: flex;
  flex-direction: column;
}

.roundedd1 {
  border-radius: 10px;
  padding-bottom: 10px;
}
</style>
