<template>
  <div> 
    <q-layout>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%;">
            <div class="col-12">
              <q-card v-if="showLevel1Card" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown1
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedCancel)"
                          @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                          @filter-leaves="handleFilterLeaves"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Pending Canceled Leaves Details
                      </div>
                      <div class="col-4 text-right">
                        <q-input class="bg-white"
                          v-model="searchTextPending"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto', }"
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8"/>
                  </template>
                  <template v-else>

                    <virtualAction
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns1"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :sortedPendingLeave="sortedPendingLeave"
                      :selectedDeptDescription="selectedDeptDescription"
                      :fetchpendingLeaves="getPendingCancel"
                      :fetchUserApproved="fetchUserCancelApprovedLeaves"
                      :fetchUserRejected="fetchUserCancelRejectedLeaves"
                      :fetchApproved="fetchApprovedCancelledLeaves"
                      :fetchRejected="fetchRejectedCancelledLeaves"
                    />

                    <div v-if="sortedPendingLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                      No data available
                    </div>
                  </template>
                </template>
                <template v-else>
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                    >
                    Pending Canceled Leaves Details
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true"/>
                  </template>
                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown1
                          style="width: 100%;"
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedCancel)"
                          @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                          @filter-leaves="handleFilterLeaves"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-12 text-right">
                        <q-input class="bg-white"
                          v-model="searchTextPending"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <qTable
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns1"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :fetchapprovedLeaves="fetchApprovedCancelledLeaves"
                      :fetchrejectedLeaves="fetchRejectedCancelledLeaves"
                      :fetchpendingLeaves="getPendingCancel"
                      :fetchUserApprovedLeaves="fetchUserCancelApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserCancelRejectedLeaves"
                      :cancelLeave="true"
                    />
                  </template>
                </template>
              </q-card>

              <q-card v-if="showLevel2Card" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                    >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown1
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedCancel)"
                          @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                          @filter-leaves="handleFilterLeaves"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Level 2 Pending Canceled Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-input class="bg-white" style="font-size: 15px;"
                          v-model="searchTextPending"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto', }"
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />
                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8"/>
                  </template>
                  <template v-else>
                    <virtualAction
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns2"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :sortedPendingLeave="sortedPendingLeave"
                      :selectedDeptDescription="selectedDeptDescription"
                      :fetchpendingLeaves="getPendingCancel"
                      :fetchUserApproved="fetchUserCancelApprovedLeaves"
                      :fetchUserRejected="fetchUserCancelRejectedLeaves"
                      :fetchApproved="fetchApprovedCancelledLeaves"
                      :fetchRejected="fetchRejectedCancelledLeaves"
                    />
                    <div v-if="sortedPendingLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                      No data available
                    </div>
                  </template>
                </template>
                <template v-else>
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                    >
                    Level 2 Pending Canceled Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true"/>
                  </template>
                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown1
                          style="width: 100%"
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedCancel)"
                          @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                          @filter-leaves="handleFilterLeaves"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextPending"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <qTable
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns2"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :fetchapprovedLeaves="fetchApprovedCancelledLeaves"
                      :fetchrejectedLeaves="fetchRejectedCancelledLeaves"
                      :fetchpendingLeaves="getPendingCancel"
                      :fetchUserApprovedLeaves="fetchUserCancelApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserCancelRejectedLeaves"
                      :cancelLeave="true"
                    />
                  </template>
                </template>
              </q-card>


              


              <div v-if="showMyCancelApproved">
                <q-card class="roundedd1">  
                  <template v-if="$q.screen.width > 900">
                    <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                      >
                      <div class="row">
                        <div class="col-4 text-left">
                          <dropdown1
                            :showHeadDept="true"
                            @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                            @my-approved="handleApprove('myApproved', userApprovedCancel)"
                            @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                            @filter-leaves="handleFilterLeaves"
                            :cancelLeave="true"
                          />
                        </div>
                        <div class="col-4 text-center">
                          My Approved Canceled Leaves
                        </div>
                        <div class="col-4 text-right">
                          <q-input class="bg-white" style="font-size: 15px;"
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '200px', marginLeft: 'auto', }"
                            :class="[ $q.screen.name + '-text2']"
                            @clear="clearSearchText"
                          />
                        </div>
                      </div>
                    </q-card-section>
                    <q-skeleton v-else :style="{ height: '65px' }" />
                    <template v-if="loading">
                      <SkeletonLoader :row-count="9" :column-count="8"/>
                    </template>
                    <template v-else>
                      <virtualScroll
                        :items="filteredLeaveRows"
                        :columns="userApprovedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :cancelView="true"
                      />
                      <div v-if="filteredLeaveRows.length === 0" class="text-center">
                        <q-icon name="warning" style="font-size: 30px;" />
                        No data available
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                    >
                      My Approve Cancelled Leaves
                    </q-card-section>
                    <q-skeleton v-else :style="{ height: '55px' }" />
                    <template v-if="loading">
                      <SkeletonLoader :mobileApproved="true"/>
                    </template>

                    <template v-else>
                      <div class="row">
                        <div class="col-12 col-sm-6">
                          <dropdown1
                            style="width: 100%"
                            :showHeadDept="true"
                            @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                            @my-approved="handleApprove('myApproved', userApprovedCancel)"
                            @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                            @filter-leaves="handleFilterLeaves"
                            :cancelLeave="true"
                          />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :class="[ $q.screen.name + '-text2']"
                            @clear="clearSearchText"
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <qTableCard
                        :items="filteredLeaveRows"
                        :columns="userApprovedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :cancelLeave="false"
                      />
                    </template>
                  </template>
                </q-card>
              </div>

              <div v-if="showMyCancelRejected">
                <q-card class="roundedd1">  
                  <template v-if="$q.screen.width > 900">
                    <q-card-section v-if="!loading" class="bg-negative text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                      >
                      <div class="row">
                        <div class="col-4 text-left">
                          <dropdown1
                            :showHeadDept="true"
                            @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                            @my-approved="handleApprove('myApproved', userApprovedCancel)"
                            @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                            @filter-leaves="handleFilterLeaves"
                            :cancelLeave="true"
                          />
                        </div>
                        <div class="col-4 text-center">
                          My Rejected Canceled Leaves
                        </div>
                        <div class="col-4 text-right">
                          <q-input class="bg-white" style="font-size: 15px;"
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '200px', marginLeft: 'auto', }"
                            :class="[ $q.screen.name + '-text2']"
                            @clear="clearSearchText"
                          />
                        </div>
                      </div>
                    </q-card-section>
                    <q-skeleton v-else :style="{ height: '65px' }" />
                    <!-- Q-Skeleton Loading -->
                    <template v-if="loading">
                      <SkeletonLoader :row-count="9" :column-count="8"/>
                    </template>
                    <template v-else>
                      <virtualScroll
                        :items="filteredLeaveRows"
                        :columns="userRejectedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :cancelView="true"
                      />
                      <div v-if="filteredLeaveRows.length === 0" class="text-center">
                        <q-icon name="warning" style="font-size: 30px;" />
                        No data available
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <q-card-section v-if="!loading" class="bg-negative text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                      >
                      My Rejected Canceled Leaves
                    </q-card-section>
                    <q-skeleton v-else :style="{ height: '55px' }" />
                    <template v-if="loading">
                      <SkeletonLoader :mobileApproved="true"/>
                    </template>

                    <template v-else>
                      <div class="row">
                        <div class="col-12 col-sm-6">
                          <dropdown1
                            style="width: 100%"
                            :showHeadDept="true"
                            @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                            @my-approved="handleApprove('myApproved', userApprovedCancel)"
                            @my-rejected="handleApprove('myRejected', userRejectedCancel)"
                            @filter-leaves="handleFilterLeaves"
                            :cancelLeave="true"
                            />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :class="[ $q.screen.name + '-text2']"
                            @clear="clearSearchText"
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <qTableCard
                        :items="filteredLeaveRows"
                        :columns="userRejectedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :cancelLeave="true"
                      />
                    </template>
                  </template>
                </q-card>
              </div>
            </div>

            <div class="col-12">
              <q-card v-show="showApprovedCancelLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown2
                          @show-approved-leaves="showApprovedCancelLeaves = true"
                          @show-rejected-leaves="showApprovedCancelLeaves = false"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Approved Canceled Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-input class="bg-white" style="font-size: 15px;"
                          v-model="searchApproveReject"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto', }"
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8"/>
                  </template>
                  <template v-else>
                    <virtualScrollResult
                      :items="filteredCancelLeaveRows"
                      :columns="approvedCancelcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :cancelView="true"
                    />
                    <div v-if="sortedPendingCancelLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                        No data available
                    </div>
                  </template>
                </template>
                <template v-else>
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Approved Canceled Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true"/>
                  </template>
                  <template v-else>
                    <div class="row">
                    <div class="col-12 col-sm-6">
                      <dropdown2
                        style="width: 100%"
                        @show-approved-leaves="showApprovedCancelLeaves = true"
                        @show-rejected-leaves="showApprovedCancelLeaves = false"
                        :cancelLeave="true"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="searchApproveReject"
                        placeholder="Search"
                        dense
                        outlined
                        clearable
                        :class="[ $q.screen.name + '-text2']"
                        @clear="clearSearchText"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <qTableView
                    :items="filteredCancelLeaveRows"
                    :columns="approvedCancelcolumns"
                    :LeaveTypeLabels="LeaveTypeLabels"
                    :cancelLeave="true"
                  />
                  </template>
                </template>
              </q-card>

              <q-card v-show="!showApprovedCancelLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-negative text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown2
                          @show-approved-leaves="showApprovedCancelLeaves = true"
                          @show-rejected-leaves="showApprovedCancelLeaves = false"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Rejected Cancelled Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-input class="bg-white" style="font-size: 15px;"
                          v-model="searchApproveReject"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :style="{ width: '200px', marginLeft: 'auto', }"
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8"/>
                  </template>
                  <template v-else>
                    <virtualScrollResult
                      :items="filteredCancelLeaveRows"
                      :columns="rejectedCancelcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :cancelView="true"
                    />
                    <div v-if="sortedPendingCancelLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                        No data available
                    </div>
                  </template>
                </template>
                <template v-else>
                  <q-card-section v-if="!loading" class="bg-negative text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  > 
                  Rejected Cancelled Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true"/>
                  </template>
                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown2
                          style="width: 100%"
                          @show-approved-leaves="showApprovedCancelLeaves = true"
                          @show-rejected-leaves="showApprovedCancelLeaves = false"
                          :cancelLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchApproveReject"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[ $q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    
                    <qTableView
                      :items="filteredCancelLeaveRows"
                      :columns="rejectedCancelcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :cancelLeave="true"
                    />
                  </template>
                </template>
              </q-card>

              
            </div>

          </div>
        </div>

        <q-dialog v-model="filterDialog">
          <q-card 
            :class="['bold-text', $q.screen.name + '-width', $q.screen.name + '-min-height']"
            class="rounded"
          >       
            <q-card-section class="bg-primary row items-center q-pb-md">
              <div class="text-h6 text-white">Pick / Choose A Department</div>
              <q-space></q-space>
              <q-btn class="bg-white" icon="close" push round dense v-close-popup></q-btn>
            </q-card-section>
            <q-card-section style="display: flex; flex-wrap: wrap;">
              <q-select
                class="hoverable-item"
                v-model="selectedDeptDescription"
                :options="deptDescriptions"
                input-debounce="0"
                label="Department"
                filled
                style="width: 100%;"
                clearable
                behavior="menu"
                fill-input
                hide-selected
                @filter="filterFn"
              use-input
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import SkeletonLoader from '../components/loadingSkeleton.vue'
import dropdown1 from '../components/DropdownMenuLeaveOps1.vue'
import dropdown2 from '../components/DropdownMenuLeaveOps2.vue'
import virtualScroll from '../components/virtualScrollView.vue'
import virtualAction from '../components/virtualScrollCancelAction.vue'
import qTable from '../components/qTableAllAction.vue'
import virtualScrollResult from '../components/virtualScrollViewResult.vue'
import helperMethods from '../helperMethods.js'
import qTableView from '../components/qTableView.vue'
import qTableCard from '../components/qTableViewCard.vue'


import { mapGetters } from 'vuex'
let deptDescriptionsOptions = []




export default {
  data () {
    return {
      showLevel1Card: true,
      showLevel2Card: false,
      showMyCancelApproved: false,
      showMyCancelRejected: false,
      searchApproveReject: '',
      showApprovedCancelLeaves: true,
      level1: false,
      level2: false,
      level1and2: false,
      pendingLeaveDetails: [],
      pendingcolumns1: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '150px', },
        { name: 'Created', label: 'Created', align: 'center', field: 'transDate', sortable: false, width: '80px', },      
        { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '80px',  },
        { name: 'Remaining Leave', label: 'Remaining Leave', align: 'center', field: 'remainingBalance', sortable: false, width: '80px',  },
        { name: 'DateFrom', label: 'Date From', align: 'left', field: 'dateLeavedFrom', sortable: false, width: '120px',  },
        { name: 'DateTo', label: 'Date To', align: 'left', field: 'dateLeavedTo', sortable: false, width: '120px',  },
        { name: 'TimeFrom', label: 'Time From', align: 'center', field: 'timeFrom', sortable: false, width: '118px' },
        { name: 'TimeTo', label: 'Time To', align: 'center', field: 'timeTo', sortable: false, width: '118px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'left', field: 'leaveType', sortable: false, width: '140px', },
        { name: 'Reason', label: 'Reason', align: 'left', sortable: false, width: '80px', },
        { name: 'Actions', label: 'Actions', align: 'center', sortable: false, width: '150px', },
      ],

      // pendingLeaveLvl2: [],
      // pendingcolumns2: [
      //   { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '150px', },  
      //   { name: 'Created', label: 'Created', align: 'center', field: 'transDate', sortable: false, width: '80px', },      
      //   { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '80px',  },
      //   { name: 'Remaining Leave', label: 'Remaining Leave', align: 'center', field: 'remainingBalance', sortable: false, width: '80px',  },
      //   { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '120px',  },
      //   { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '120px',  },
      //   { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '140px', },
      //   { name: 'Reason', label: 'Reason', align: 'left', sortable: false, width: '80px', },
      //   { name: 'Actions', label: 'Actions', align: 'center', sortable: false, width: '150px', },
      // ],

      userApprovedCancel: [],
      userApprovedcolumns: [
          { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
          { name: 'Date Approved', label: 'Date Approved', align: 'center', sortable: false, width: '100px' },            
          { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
          { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
          { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
          { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
          { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      userRejectedCancel: [],
      userRejectedcolumns: [
          { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
          { name: 'Date Rejected', label: 'Date Rejected', align: 'center', sortable: false, width: '100px' },            
          { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
          { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
          { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
          { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
          { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      rejectedCancel: [],
      rejectedCancelcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px' }, 
        { name: 'Date Rejected', label: 'Date Rejected', align: 'center', sortable: false, width: '100px' },             
        { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
        { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      approvedCancel: [],
      approvedCancelcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
        { name: 'Date Approved', label: 'Date Approved', align: 'center', sortable: false, width: '100px' },            
        { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
        { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],


      searchTextPending: '',
      loading: true,
      filterDialog: false,
      selectedDeptDescription: '',
      deptDescriptions: deptDescriptionsOptions,
      loadingCounter: null,
      

    }
  },

  components: {
    dropdown1,
    SkeletonLoader,
    virtualAction,
    dropdown2,
    virtualScroll,
    virtualScrollResult,
    qTable,
    qTableView,
    qTableCard
  },

  computed : {

    ...mapGetters({ leaveTypes: "leaveModule/leaveTypes",
      cancelPending: "leaveModule/cancelPending",
      userAppCancel: "leaveModule/userApprovedCancel",
      userRejectCancel: "leaveModule/userRejectedCancel",
      appCancel: "leaveModule/approvedCancel",
      rejectCancel: "leaveModule/rejectedCancel"
    }),

    sortedPendingLeave() {
      let data;
      switch(true) {
        case this.showLevel1Card:
          data = this.pendingLeaveDetails;
          break;
        // case this.showLevel2Card:
        //   data = this.pendingLeaveLvl2;
        //   break;
        case this.showMyCancelApproved:
          data = this.userApprovedCancel;
          break;
        case this.showMyCancelRejected:
          data = this.userRejectedCancel;
          break;
        default:
          data = this.approvedDetails;
      }
      return this.sortPendingLeave(data);
    },

    sortedPendingCancelLeave() {
      let data;
      switch(true) {
        case this.showApprovedCancelLeaves:
          data = this.approvedCancel;
          break;
        case !this.showApprovedCancelLeaves:
          data = this.rejectedCancel;
          break;
        default:
          data = this.approvedDetails;
      }
      return this.processLeaves(data);
    },


    filteredLeaveRows() {
      if (!this.selectedDeptDescription) {
        return this.sortedPendingLeave;
      } else {
        this.filterDialog = false
        return this.sortedPendingLeave.filter(row => row.deptDescription === this.selectedDeptDescription);
      }
    },

    filteredCancelLeaveRows() {
      if (!this.selectedDeptDescription) {
        return this.sortedPendingCancelLeave;
      } else {
        this.filterDialog = false
        return this.sortedPendingCancelLeave.filter(row => row.deptDescription === this.selectedDeptDescription);
      }
    },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, LeaveType) => {
        acc[LeaveType.value] = LeaveType.label;
        return acc;
      }, {});
    },



  },

  methods : {

    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.deptDescriptions = deptDescriptionsOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.deptDescriptions = deptDescriptionsOptions.filter(option => option.toLowerCase().indexOf(needle) > -1);
      });
    },

    sortPendingLeave(pendingLeave) {
      if (!pendingLeave || pendingLeave.length === 0) {
        return [];
      }
      
      return pendingLeave
        .map(row => ({
          ...row,
          EmployeeName: `${row.lastName}, ${row.firstName} ${row.middleInitial + '.'}`,
          transDate: row.transDate.split('T')[0].replace(/-/g, '/'),
          remainingBalance: row.leaveType === 'LWOP' ? '-' : (row.remainingBalance != null ? parseFloat(row.remainingBalance.toFixed(2)) : '-')
        }))
        .filter(row => {
          const query = this.searchTextPending.toLowerCase();
          const formattedTransDate = row.transDate.replace(/-/g, '/');
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query) ||
            formattedTransDate.includes(query)

          );
        })
        .sort((a, b) => b.leaveId - a.leaveId);
    },


    processLeaves(leaves) {
      return leaves
        .map(row => ({
          ...row,
          EmployeeName: `${row.lastName}, ${row.firstName} ${row.middleInitial}`,
          transDate: row.transDate.split('T')[0].replace(/-/g, '/'),
        }))
        .filter(row => {
          const query = this.searchApproveReject.toLowerCase();
          const formattedTransDate = row.transDate.replace(/-/g, '/');
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query) ||
            formattedTransDate.includes(query)
          );
        })
        .sort((a, b) => b.leaveId - a.leaveId);
    },


    async getPendingCancel() {
      try {
        await helperMethods.delay(1500)
        await this.$store.dispatch('leaveModule/getPendingCancel')
        // const { lvl1Pending, lvl2Pending } = this.cancelPending;
        this.pendingLeaveDetails = this.cancelPending

        // if (lvl1Pending && lvl2Pending) {
        //   this.pendingLeaveDetails = lvl1Pending;
        //   this.pendingLeaveLvl2 = lvl2Pending;
        //   this.level1and2 = true;
        // } else if (lvl1Pending && !lvl2Pending) {
        //   this.pendingLeaveDetails = lvl1Pending;
        //   this.level1 = true;
        // } else {
        //   this.level2 = true;
        //   this.pendingLeaveLvl2 = lvl2Pending;
        // }

        const localStorageShowLevel1Card = localStorage.getItem('showLevel1Card');
        const localStorageShowMyCancelApproved = localStorage.getItem('showMyCancelApproved');
        const localStorageShowMyCancelRejected = localStorage.getItem('showMyCancelRejected');

        if (localStorageShowLevel1Card !== null && 
        localStorageShowMyCancelApproved !== null &&
        localStorageShowMyCancelRejected !== null) {
          this.showLevel1Card = localStorageShowLevel1Card === 'true';
          this.showMyCancelApproved = localStorageShowMyCancelApproved === 'true';
          this.showMyCancelRejected = localStorageShowMyCancelRejected === 'true'
        } else {
          this.showLevel1Card = true;
        }

        const pendingLeave = this.pendingLeaveDetails;
        deptDescriptionsOptions = [...new Set(pendingLeave.map(leave => leave.deptDescription))];

        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }

      } catch (error) {
        console.error(error, 'Failed to fetch pending cancel leave')
      }
    },

    handleApprove(cardType, dataList) {
      this.showLevel1Card = cardType === 'headApprove';
      this.showMyCancelApproved = cardType === 'myApproved';
      this.showMyCancelRejected = cardType === 'myRejected';

      this.selectedItems = [];
      this.selectedDeptDescription = '';

      localStorage.setItem('showHeadApproveCard', cardType === 'headApprove');
      localStorage.setItem('showMyCancelApproved', cardType === 'myApproved');
      localStorage.setItem('showMyCancelRejected', cardType === 'myRejected');

      deptDescriptionsOptions = [...new Set(dataList.map(leave => leave.deptDescription))];
    },
    
    handleFilterLeaves() {
      this.filterDialog = true;
    },

    clearSearchText() {
      this.searchTextPending = '';
      this.searchApproveReject = '';
    },
    

    

    async fetchUserCancelApprovedLeaves() {
      try {
        await helperMethods.delay(1500)
        await this.$store.dispatch('leaveModule/fetchUserCancelApprovedLeaves')
        this.userApprovedCancel = this.userAppCancel
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, 'Failed to fetch user approved cancel leave')
      }
    },

    async fetchUserCancelRejectedLeaves() {
      try {
        await helperMethods.delay(1500)
        await this.$store.dispatch('leaveModule/fetchUserCancelRejectedLeaves')
        this.userRejectedCancel = this.userRejectCancel
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, 'Failed to fetch user rejected cancel leave')
      }
    },

    async fetchApprovedCancelledLeaves() {
      try {
        await helperMethods.delay(1500)
        await this.$store.dispatch('leaveModule/fetchApprovedCancelledLeaves')
        this.approvedCancel = this.appCancel
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, 'Failed to fetch approved cancel leave')
      }
    },

    async fetchRejectedCancelledLeaves() {
      try {
        await helperMethods.delay(1500)
        await this.$store.dispatch('leaveModule/fetchRejectedCancelledLeaves')
        this.rejectedCancel = this.rejectCancel
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error(error, 'Failed to fetch rejected cancel leave')
      }
    },

    async fetchLeaveTypes() {
      try {
        await this.$store.dispatch('leaveModule/fetchLeaveTypes');
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get the leave types')
      }
    },


  },
  
  created() {
    this.getPendingCancel();
    this.fetchUserCancelApprovedLeaves();
    this.fetchUserCancelRejectedLeaves();
    this.fetchApprovedCancelledLeaves();
    this.fetchRejectedCancelledLeaves();
    this.fetchLeaveTypes()

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('showLevel1Card', this.showLevel1Card.toString());
      // localStorage.setItem('showLevel2Card', this.showLevel2Card.toString());
      localStorage.setItem('showMyCancelApproved', this.showMyCancelApproved.toString());
      localStorage.setItem('showMyCancelRejected', this.showMyCancelRejected.toString());

      
    });
  }
}
</script>


