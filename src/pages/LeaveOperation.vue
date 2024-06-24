<template>
  <q-layout>
    <q-page> 
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%;">
            <!-- Pending Leaves -->
            <!-- <div v-if="this.selectedItems.length > 1" class="col-12">
              <div class="q-mb-xs text-center"  style="display: flex; justify-content: center; gap: 10px;">
                <q-btn push color="primary" class="q-mr-xs" @click="approveLeave(selectedItems)" label="Approve Selected Leave" />
                <q-btn push color="red" class="q-ml-xs" @click="rejectLeaveDia(selectedItems)" label="Reject Selected Leave" />                
              </div>
            </div> -->
            <div class="col-12">
              <q-card v-if="showHeadApproveCard" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown1
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedLeave)"
                          @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                          @filter-leaves="handleFilterLeaves"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Pending Leaves Details
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
                    <virtualScrollAction
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns1"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :sortedPendingLeave="sortedPendingLeave"
                      :selectedDeptDescription="selectedDeptDescription"
                      :fetchapprovedLeaves="fetchapprovedLeaves"
                      :fetchrejectedLeaves="fetchrejectedLeaves"
                      :fetchpendingLeaves="fetchpendingLeaves"
                      :fetchUserApprovedLeaves="fetchUserApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserRejectedLeaves"
                    />
                    <!-- <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="filteredLeaveRows"
                      >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th style="width: 10px;">
                              <q-checkbox v-model="selectAllLevel1" @click="selectAllItems"> </q-checkbox>
                            </th>
                            <th v-for="col in pendingcolumns1" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>
                      <template v-slot="{ item: row, name }">
                        <q-tr :key="name">
                          <q-td style="width: 10px;" class="text-center">
                            <q-checkbox v-model="selectedItems" :val="row" @click="selectedRows"/>
                          </q-td>
                          <q-td v-for="col in pendingcolumns1" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                            <template v-if="col.name === 'Actions'">
                              <div class="actions-column">
                                <q-card style="width: 100%;">
                                  <q-btn
                                    push
                                    @click="approveLeave(row.leaveId)"
                                    icon="check_circle"
                                    color="green"
                                    label="Approve"
                                    class="q-mr-xs"
                                    style="width: 100%;"
                                    :disable="selectedItems.length > 1"
                                  />
                                </q-card>
                                <q-card style="width: 100%; margin-top: 5px">
                                  <q-btn
                                    push
                                    @click="rejectLeaveDia(row.leaveId)"
                                    icon="cancel"
                                    color="negative"
                                    label="Reject"
                                    style="width: 100%;"
                                    :disable="selectedItems.length > 1"
                                  />
                                </q-card>
                              </div>
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll> -->

                    <div v-if="sortedPendingLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Pending Leaves Details
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true"/>

                    <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 6" :key="index">
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
                        <dropdown1
                          style="width: 100%"
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedLeave)"
                          @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                          @filter-leaves="handleFilterLeaves"
                          :pendingLeave="true"
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
                      :columns="pendingcolumns1"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :fetchapprovedLeaves="fetchapprovedLeaves"
                      :fetchrejectedLeaves="fetchrejectedLeaves"
                      :fetchpendingLeaves="fetchpendingLeaves"
                      :fetchUserApprovedLeaves="fetchUserApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserRejectedLeaves"
                    />
                    <!-- <q-table
                      v-if="sortedPendingLeave.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="filteredLeaveRows"
                      :columns="pendingcolumns1"
                      row-key="leaveId"
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                      >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card bordered flat :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0
                            }">
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.name === 'Actions'">
                                  <q-item-section side>
                                    <div class="insideCard">
                                      <q-card style="width: 100%;">
                                        <q-btn
                                          push
                                          @click="approveLeave(props.row.leaveId)"
                                          icon="check_circle"
                                          color="green"
                                          label="Approve"
                                          class="q-mr-xs"
                                          style="width: 100%;"
                                        />
                                      </q-card>
                                      <q-card style="width: 100%; margin-top: 5px">
                                        <q-btn
                                          push
                                          @click="rejectLeaveDia(props.row.leaveId)"
                                          icon="cancel"
                                          color="negative"
                                          label="Reject"
                                          style="width: 100%;"
                                        />
                                      </q-card>
                                    </div>
                                  </q-item-section>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label class="text-bold text-black" caption style="padding-top: 2px;" >
                                      {{
                                        col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'leaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table> -->
                  </template>
                </template>
              </q-card>

              <q-card v-if="showSupervisorCard" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                    >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown1
                          :showHeadDept="true"
                          @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                          @my-approved="handleApprove('myApproved', userApprovedLeave)"
                          @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                          @filter-leaves="handleFilterLeaves"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Level 2 Pending Leaves
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
                    <virtualScrollAction
                      :items="filteredLeaveRows"
                      :columns="pendingcolumns2"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :sortedPendingLeave="sortedPendingLeave"
                      :selectedDeptDescription="selectedDeptDescription"
                      :fetchapprovedLeaves="fetchapprovedLeaves"
                      :fetchrejectedLeaves="fetchrejectedLeaves"
                      :fetchpendingLeaves="fetchpendingLeaves"
                      :fetchUserApprovedLeaves="fetchUserApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserRejectedLeaves"
                    />
                    <!-- <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="filteredLeaveRows"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th style="width: 10px;">
                              <q-checkbox v-model="selectAllLevel2" @click="selectAllItems"> </q-checkbox>
                            </th>
                            <th v-for="col in pendingcolumns2" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>
                      <template v-slot="{ item: row, name }">
                        <q-tr :key="name">
                          <q-td style="width: 10px;" class="text-center">
                            <q-checkbox v-model="selectedItems" :val="row" @click="selectedRows"/>
                          </q-td>
                          <q-td v-for="col in pendingcolumns2" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                            <template v-if="col.name === 'Actions'">
                              <div class="actions-column">
                                <q-card style="width: 100%;">
                                  <q-btn
                                    push
                                    @click="approveLeave(row.leaveId)"
                                    icon="check_circle"
                                    color="green"
                                    label="Approve"
                                    class="q-mr-xs"
                                    style="width: 100%;"
                                    :disable="selectedItems.length > 1"
                                  />
                                </q-card>
                                <q-card style="width: 100%; margin-top: 5px">
                                  <q-btn
                                    push
                                    @click="rejectLeaveDia(row.leaveId)"
                                    icon="cancel"
                                    color="negative"
                                    label="Reject"
                                    style="width: 100%;"
                                    :disable="selectedItems.length > 1"
                                  />
                                </q-card>
                              </div>
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll> -->
                    <div v-if="sortedPendingLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"

                  >
                    Level 2 Pending Leaves
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
                          @my-approved="handleApprove('myApproved', userApprovedLeave)"
                          @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                          @filter-leaves="handleFilterLeaves"
                          :pendingLeave="true"
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
                      :fetchapprovedLeaves="fetchapprovedLeaves"
                      :fetchrejectedLeaves="fetchrejectedLeaves"
                      :fetchpendingLeaves="fetchpendingLeaves"
                      :fetchUserApprovedLeaves="fetchUserApprovedLeaves"
                      :fetchUserRejectedLeaves="fetchUserRejectedLeaves"
                    />
                    <!-- <q-table
                      v-if="sortedPendingLeave.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="filteredLeaveRows"
                      :columns="pendingcolumns2"
                      row-key="leaveId"
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card bordered flat :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0
                            }">
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.name === 'Actions'">
                                  <q-item-section side>
                                    <div class="insideCard">
                                      <q-card style="width: 100%;">
                                        <q-btn
                                          push
                                          @click="approveLeave(props.row.leaveId)"
                                          icon="check_circle"
                                          color="green"
                                          label="Approve"
                                          class="q-mr-xs"
                                          style="width: 100%;"
                                        />
                                      </q-card>
                                      <q-card style="width: 100%; margin-top: 5px">
                                        <q-btn
                                          push
                                          @click="rejectLeaveDia(props.row.leaveId)"
                                          icon="cancel"
                                          color="negative"
                                          label="Reject"
                                          style="width: 100%;"
                                        />
                                      </q-card>
                                    </div>
                                  </q-item-section>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label class="text-bold text-black" caption style="padding-top: 2px;" >
                                      {{
                                        col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'leaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table> -->
                  </template>
                </template>
              </q-card>

              <div v-if="showMyApproved">
                <q-card class="roundedd1">  
                  <template v-if="$q.screen.width > 900">
                    <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                      >
                      <div class="row">
                        <div class="col-4 text-left">
                          <dropdown1
                            :showHeadDept="true"
                            @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                            @my-approved="handleApprove('myApproved', userApprovedLeave)"
                            @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-4 text-center">
                          My Approved Leaves
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
                        :columns="userApprovedcolumns"
                        :LeaveTypeLabels="LeaveTypeLabels"
                        :leaveView="true"
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
                    My Approved Leaves
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
                            @my-approved="handleApprove('myApproved', userApprovedLeave)"
                            @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '200px', marginLeft: 'auto', }"
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
              
              <div v-if="showMyRejected">
                <q-card class="roundedd1"> 
                  <template v-if="$q.screen.width > 900">
                    <q-card-section v-if="!loading" class="bg-negative text-white  text-center"
                      :class="['bold-text', $q.screen.name + '-text']"
                      >
                      <div class="row">
                        <div class="col-4 text-left">
                          <dropdown1
                            :showHeadDept="true"
                            @head-approve="handleApprove('headApprove', pendingLeaveDetails)"
                            @my-approved="handleApprove('myApproved', userApprovedLeave)"
                            @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-4 text-center">
                          My Rejected Leaves
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
                        :leaveView="true"
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
                      My Rejected Leaves
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
                            @my-approved="handleApprove('myApproved', userApprovedLeave)"
                            @my-rejected="handleApprove('myRejected', userRejectedLeave)"
                            @filter-leaves="handleFilterLeaves"
                            :pendingLeave="true"
                          />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '200px', marginLeft: 'auto', }"
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
                        :cancelLeave="false"
                      />
                    </template>
                  </template>
                </q-card>
              </div>
            </div>

            <!-- Approved Leaves -->
            <div class="col-12">
              <q-card v-show="showApprovedLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown2
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Approved Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-input class="bg-white" style="font-size: 15px;"
                          v-model="searchTextAppRej"
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

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8"/>
                  </template>
                  <template v-else>
                    <virtualScrollResult
                      :items="filteredLeaveRowsAppRej"
                      :columns="approvedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveView="true"
                    />
                    <div v-if="filteredLeaveRowsAppRej.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                        No data available
                    </div>
                  </template>
                  
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Approved Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true"/>
                    <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 6" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div> -->
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown2
                          style="width: 100%"
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextAppRej"
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
                      :items="filteredLeaveRowsAppRej"
                      :columns="approvedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                    />

                    <!-- <q-table
                      v-if="sortedapprovedLeaves.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedapprovedLeaves"
                      :columns="approvedcolumns"
                      row-key="leaveId"
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card bordered flat :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0
                            }">
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.name === 'Actions/Status'">
                                  <q-item-section side>
                                    <template v-if="props.row.status === 'Approved'" >
                                      <div class="insideCard">
                                        <q-card style="width: 100%; margin-bottom: 5px">
                                          <q-card-section class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                                            Approved
                                          </q-card-section>
                                        </q-card>
                                      </div>
                                    </template>
                                  </q-item-section>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label class="text-bold text-black" caption style="padding-top: 2px;" >
                                      {{ 
                                        col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'leaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table> -->
                  </template>
                </template>
              </q-card>

              <!-- Rejected Leaves -->
              <q-card v-show="!showApprovedLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-negative text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <dropdown2
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-4 text-center">
                        Rejected Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-input class="bg-white" style="font-size: 15px;"
                          v-model="searchTextAppRej"
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

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <SkeletonLoader :row-count="9" :column-count="8"/>
                  </template>

                  <template v-else>
                    <virtualScrollResult
                      :items="filteredLeaveRowsAppRej"
                      :columns="rejectedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveView="true"
                    />
                    <div v-if="filteredLeaveRowsAppRej.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px"/>
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-negative text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  > 
                    Rejected Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true"/>
                    <!-- <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 6" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div> -->
                  </template>
                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <dropdown2
                          style="width: 100%"
                          @show-approved-leaves="showApprovedLeaves = true"
                          @show-rejected-leaves="showApprovedLeaves = false"
                          :pendingLeave="true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextAppRej"
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
                      v-if="filteredLeaveRowsAppRej.length > 0"
                      :items="filteredLeaveRowsAppRej"
                      :columns="rejectedcolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                    />
                    <!-- <q-table
                      v-if="sortedrejectedLeaves.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedrejectedLeaves"
                      :columns="rejectedcolumns"
                      row-key="leaveId"
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
                                <template v-if="col.name === 'Actions/Status'">
                                  <div class="insideCard">
                                    <template v-if="props.row.status === 'RejectedByLevel1' || props.row.status === 'RejectedByLevel2'">
                                      <q-card style="width: 100%; margin-bottom: 5px">
                                        <q-card-section class="bg-negative text-white text-center" style="line-height: 25%;">
                                          Rejected
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                  </div>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label class="text-bold text-black" caption style="padding-top: 2px;" >
                                      {{ 
                                        col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'leaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table> -->
                  </template>
                </template>
              </q-card>
            </div>
          </div>

          <!-- <q-dialog v-model="rejectDialog">
            <q-card :style="{ 
              'min-width': $q.screen.lt.sm ? '250px' : $q.screen.lt.md ? '350px' : '450px',
              'min-height': $q.screen.lt.sm ? '100px' : $q.screen.lt.md ? '100px' : '100px'
              }"
              class="rounded"
            >
              <q-card-section class="bg-primary row items-center q-pb-sm">
                <div class="text-h6 text-white text-bold">Reason For Rejecting Leave(s)</div>
                <q-space></q-space>
                <q-btn class="bg-white" icon="close" push round dense padding="xs" v-close-popup></q-btn>
              </q-card-section>
              <q-card-section class="q-pt-xm" >
                <q-input filled v-model="reasonForRejection" placeholder="Type here" type=textarea></q-input>
              </q-card-section>
              <q-card-actions style="display: flex; justify-content: center">
                <div style="display: flex; justify-content: center; gap: 15px;">
                  <q-btn class="bg-primary text-white" push label="confirm" @click="rejectLeave"/>
                  <q-btn class="bg-negative text-white" push label="cancel" @click="cancelReject"/>
                </div>
              </q-card-actions>
            </q-card>
          </q-dialog> -->

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
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>



<script>
import helperMethods from '../helperMethods.js'
import dropdown1 from '../components/DropdownMenuLeaveOps1.vue'
import dropdown2 from '../components/DropdownMenuLeaveOps2.vue'
import virtualScroll from '../components/virtualScrollView.vue'
import virtualScrollAction from '../components/virtualScrollAction.vue'
import virtualScrollResult from '../components/virtualScrollViewResult.vue'
import SkeletonLoader from '../components/loadingSkeleton.vue'
import qTable from '../components/qTableAllAction.vue'
import qTableView from '../components/qTableView.vue'
import { mapGetters } from 'vuex';
import qTableCard from '../components/qTableViewCard.vue'


let deptDescriptionsOptions = []

export default {


  data() {
    return {
      disableInteraction: false,
      rejectId: '',
      rejectDialog: false,
      reasonForRejection: '',
      showApprovedLeaves: true,
      showHeadApproveCard: true,
      showSupervisorCard: false,
      level1and2: false,
      level1: false,
      level2: false,
      searchTextMyApproved: '',
      searchTextMyRejected: '',
      searchTextPending: '',
      loadingCounter: null,
      loading: true,
      showApprovedLeaves: true,
      leaveAction: false,
      skeletonAnimations: [
        'wave', 'fade', 'fade', 'none'
      ],
      LeaveTypes: [],
      approvedLeaves: [],
      approvedcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
        { name: 'Date Approved', label: 'Date Approved', align: 'center', sortable: false, width: '100px' },            
        { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
        { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      rejectedLeaves: [],
      rejectedcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px' }, 
        { name: 'Date Rejected', label: 'Date Rejected', align: 'center', sortable: false, width: '100px' },             
        { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
        { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      pendingLeaveDetails: [],
      pendingcolumns1: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '150px', },
        { name: 'Created', label: 'Created', align: 'center', field: 'transDate', sortable: false, width: '80px', },      
        { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '80px',  },
        { name: 'Remaining Leave', label: 'Remaining Leave', align: 'center', field: 'remainingBalance', sortable: false, width: '80px',  },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '120px',  },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '120px',  },
        { name: 'TimeFrom', label: 'Time From', align: 'center', field: 'timeFrom', sortable: false, width: '118px' },
        { name: 'TimeTo', label: 'Time To', align: 'center', field: 'timeTo', sortable: false, width: '118px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '140px', },
        { name: 'Reason', label: 'Reason', align: 'left', sortable: false, width: '80px', },
        { name: 'Actions', label: 'Actions', align: 'center', sortable: false, width: '150px', },
      ],

      // pendingLeaveLvl2: [],
      // pendingcolumns2: [
      //   { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '150px', },  
      //   { name: 'Created', label: 'Created', align: 'center', field: 'transDate', sortable: false, width: '80px', },      
      //   { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '80px',  },
      //   { name: 'Remaining Leave', label: 'Remaining Leave', align: 'center', field: 'remainingBalance', sortable: false, width: '80px',  },
      //   { name: 'Date From', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '120px',  },
      //   { name: 'Date To', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '120px',  },
      //   { name: 'TimeFrom', label: 'Time From', align: 'center', field: 'tIME_FROM', sortable: false, width: '118px' },
      //   { name: 'TimeTo', label: 'Time To', align: 'center', field: 'tIME_TO', sortable: false, width: '118px' },
      //   { name: 'Leave Type', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '140px', },
      //   { name: 'Reason', label: 'Reason', align: 'left', sortable: false, width: '80px', },
      //   { name: 'Actions', label: 'Actions', align: 'center', sortable: false, width: '150px', },
      // ],

      leaveBalance: [],
      balancecolumns: [
        { name: 'Year', label: 'Year', align: 'center', field: 'Year', sortable: false},
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'LeaveType', format: (val) => this.LeaveTypeLabels[val], sortable: false},
        { name: 'Balance', label: 'Balance', align: 'center', field: 'Balance', sortable: false},
      ],

      userApprovedLeave: [],
      userApprovedcolumns: [
          { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
          { name: 'Date Approved', label: 'Date Approved', align: 'center', sortable: false, width: '100px' },            
          { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
          { name: 'Date From', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
          { name: 'Date To', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
          { name: 'Leave Type', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
          { name: 'Reason', label: 'Reason', align: 'left', sortable: false, width: '80px', },
          { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],
      userRejectedLeave: [],
      userRejectedcolumns: [
          { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
          { name: 'Date Rejected', label: 'Date Rejected', align: 'center', sortable: false, width: '100px' },            
          { name: 'Days', label: 'Days', align: 'center', field: 'daysOfLeave', sortable: false, width: '100px' },
          { name: 'Date From', label: 'Date From', align: 'center', field: 'dateLeavedFrom', sortable: false, width: '140px' },
          { name: 'Date To', label: 'Date To', align: 'center', field: 'dateLeavedTo', sortable: false, width: '140px' },
          { name: 'Leave Type', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false, width: '150px' },
          { name: 'Reason', label: 'Reason', align: 'left', sortable: false, width: '80px', },
          { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],
      selectedItems: [],
      selectAllLevel1: false,
      selectAllLevel2: false,
      deptValidation: false,
      filterDialog: false,
      selectedDeptDescription: '',
      deptDescriptions: deptDescriptionsOptions,
      showMyApproved: false,
      showMyRejected: false,
      searchTextAppRej: ''
    };
  },

  components: {
    dropdown1,
    dropdown2,
    virtualScroll,
    virtualScrollAction,
    SkeletonLoader,
    virtualScrollResult,
    qTable,
    qTableView,
    qTableCard
  },

  computed: {

    ...mapGetters({ leaveTypes: "leaveModule/leaveTypes",
      pendingDetails: "leaveModule/pendingDetails",
      appDetails: "leaveModule/approvedDetails",
      rejectDetails: "leaveModule/rejectedDetails",
      userAppLeave: "leaveModule/userApprovedLeave",
      userRejectLeave: "leaveModule/userRejectedLeave",
      userCode: "user_module/employee_id"
    }),

    sortedPendingLeave() {
      let data;
      switch(true) {
        case this.showHeadApproveCard:
          data = this.pendingLeaveDetails;
          break;
        case this.showMyApproved:
          data = this.userApprovedLeave;
          break;
        case this.showMyRejected:
          data = this.userRejectedLeave;
          break;
        default:
          data = this.approvedDetails;
      }
      return this.sortPendingLeave(data);
    },

    sortedAppRejLeave() {
      let data;
      switch(true) {
        case this.showApprovedLeaves:
          data = this.approvedLeaves;
          break;
        case !this.showApprovedLeaves:
          data = this.rejectedLeaves;
          break;
        default:
          data = []
      }
      return this.sortAppRejLeave(data);
    },

    // sortedapprovedLeaves() {
    //   return this.processLeaves(this.approvedLeaves, this.searchTextAppRej);
    // },

    // sortedrejectedLeaves() {
    //   return this.processLeaves(this.rejectedLeaves, this.searchTextAppRej);
    // },

    // sortedMyApprovedLeaves() {
    //   return this.processLeaves(this.userApprovedLeave, this.searchTextMyApproved);
    // },

    // sortedMyRejectedLeaves() {
    //   return this.processLeaves(this.userRejectedLeave, this.searchTextMyApproved);
    // },

    // sortedapprovedLeaves() {
    //   return this.approvedLeaves
    //   .map(row => ({
    //       ...row,
    //       EmployeeName: `${row.lastName}, ${row.firstName} ${row.middleInitial}`,
    //       transDate: row.transDate.split('T')[0].replace(/-/g, '/'),
    //     }))
    //     .filter(row => {
    //       const query = this.searchTextAppRej.toLowerCase();
    //       return (
    //         row.EmployeeName.toLowerCase().includes(query) ||
    //         row.leaveId.toString().toLowerCase().includes(query) ||
    //         this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
    //       );
    //     })
    //     .sort((a, b) => b.leaveId - a.leaveId);
    // },

    // sortedrejectedLeaves() {
    //   return this.rejectedLeaves
    //   .map(row=> ({
    //       ...row,
    //       EmployeeName: `${row.lastName}, ${row.firstName} ${row.middleInitial}`,
    //       transDate: row.transDate.split('T')[0].replace(/-/g, '/'),
    //     }))
    //     .filter(row => {
    //       const query = this.searchTextAppRej.toLowerCase();
    //       return (
    //         row.EmployeeName.toLowerCase().includes(query) ||
    //         row.leaveId.toString().toLowerCase().includes(query) ||
    //         this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
    //       );
    //     })
    //     .sort((a, b) => b.leaveId - a.leaveId);
    // },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, LeaveType) => {
        acc[LeaveType.value] = LeaveType.label;
        return acc;
      }, {});
    },

    filteredLeaveRows() {
      if (!this.selectedDeptDescription) {
        return this.sortedPendingLeave;
      } else {
        this.filterDialog = false
        return this.sortedPendingLeave.filter(row => row.deptDescription === this.selectedDeptDescription);
      }
    },

    filteredLeaveRowsAppRej() {
      if (!this.selectedDeptDescription) {
        return this.sortedAppRejLeave;
      } else {
        this.filterDialog = false
        return this.sortedAppRejLeave.filter(row => row.deptDescription === this.selectedDeptDescription);
      }
    },

  },

  methods: {

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

      console.log(pendingLeave)
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

    sortAppRejLeave(pendingLeave) {
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
          const query = this.searchTextAppRej.toLowerCase();
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

    // processLeaves(leaves, searchText, leaveTypeLabels) {
    //   return leaves
    //     .map(row => ({
    //       ...row,
    //       EmployeeName: `${row.lastName}, ${row.firstName} ${row.middleInitial}`,
    //       transDate: row.transDate.split('T')[0].replace(/-/g, '/'),
    //     }))
    //     .filter(row => {
    //       const query = searchText.toLowerCase();
    //       return (
    //         row.EmployeeName.toLowerCase().includes(query) ||
    //         row.leaveId.toString().toLowerCase().includes(query) ||
    //         this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
    //       );
    //     })
    //     .sort((a, b) => b.leaveId - a.leaveId);
    // },


    // rejectLeaveDia(leaveId) {
    //   this.rejectDialog = true;
    //   this.rejectId = leaveId;
    // },

    // cancelReject() {
    //   this.reasonForRejection = '';
    //   this.rejectDialog = false;
    // },

    // selectAllItems() {
    //   if (this.selectAllLevel1) {
    //     if (this.selectedDeptDescription.length > 0 && this.deptValidation === false) {
    //       this.selectedItems = this.sortedPendingLeave.filter(row => row.deptDescription === this.selectedDeptDescription);
    //       this.deptValidation = true
    //     } else {
    //       this.selectedItems = [...this.sortedPendingLeave];
    //     }
    //   } else if (this.selectAllLevel2 && this.deptValidation === false) {
    //     if (this.selectedDeptDescription.length > 0) {
    //       this.selectedItems = this.sortedPendingLeave.filter(row => row.deptDescription === this.selectedDeptDescription)
    //       this.deptValidation = true
    //     } else {
    //       this.selectedItems = [...this.sortedPendingLeave];
    //     }
    //   } else {
    //     this.selectedItems = []; // Deselect all rows
    //   }

    //   this.deptValidation = false
    // },

    // selectedRows() {
    //   this.selectAllLevel1 = false
    //   this.selectAllLevel2 = false
    // },


    clearSearchText() {
      this.searchTextPending = '';
      this.searchTextAppRej = '';
      this.searchTextAppRej = '';
      this.searchTextMyApproved = '';
      this.searchTextMyRejected = '';
    },

    // handleHeadApprove() {
    //   this.showMyApproved = false,
    //   this.showSupervisorCard = false;
    //   this.showMyRejected = false,
    //   this.showHeadApproveCard = true;
    //   this.selectedItems = [];
    //   this.selectedDeptDescription = '';
    //   localStorage.setItem('showHeadApproveCard', true.toString());
    //   localStorage.setItem('showSupervisorCard', false.toString());
    //   localStorage.setItem('showMyApproved', false.toString());
    //   localStorage.setItem('showMyRejected', false.toString());

    //   this.deptDescriptions = [...new Set(this.pendingLeaveDetails.map(leave => leave.deptDescription))];
    // },
    // handleSupervisorApprove() {
    //   this.showMyApproved = false,
    //   this.showSupervisorCard = true;
    //   this.showMyRejected = false,
    //   this.showHeadApproveCard = false;
    //   this.selectedItems = [];
    //   this.selectedDeptDescription = '';
    //   localStorage.setItem('showHeadApproveCard', false.toString());
    //   localStorage.setItem('showSupervisorCard', true.toString());
    //   localStorage.setItem('showMyApproved', false.toString());
    //   localStorage.setItem('showMyRejected', false.toString());
    //   this.deptDescriptions = [...new Set(this.pendingLeaveLvl2.map(leave => leave.deptDescription))];
    // },
    // handleMyApproved() {
    //   this.showMyApproved = true;
    //   this.showSupervisorCard = false;
    //   this.showMyRejected = false;
    //   this.showHeadApproveCard = false;
    //   this.selectedItems = [];
    //   this.selectedDeptDescription = '';
    //   localStorage.setItem('showHeadApproveCard', false.toString());
    //   localStorage.setItem('showSupervisorCard', false.toString());
    //   localStorage.setItem('showMyApproved', true.toString());
    //   localStorage.setItem('showMyRejected', false.toString());
    //   this.deptDescriptions = [...new Set(this.userApprovedLeave.map(leave => leave.deptDescription))];
    // },
    // handleMyRejected() {
    //   this.showMyRejected = true;
    //   this.showMyApproved = false;
    //   this.showSupervisorCard = false;
    //   this.showHeadApproveCard = false;
    //   this.selectedItems = [];
    //   this.selectedDeptDescription = '';
    //   localStorage.setItem('showHeadApproveCard', false.toString());
    //   localStorage.setItem('showSupervisorCard', false.toString());
    //   localStorage.setItem('showMyApproved', false.toString());
    //   localStorage.setItem('showMyRejected', true.toString());
    //   this.deptDescriptions = [...new Set(this.userRejectedLeave.map(leave => leave.deptDescription))];
    // },

    handleApprove(cardType, dataList) {
      this.showMyApproved = cardType === 'myApproved';
      this.showMyRejected = cardType === 'myRejected';
      this.showHeadApproveCard = cardType === 'headApprove';

      this.selectedItems = [];
      this.selectedDeptDescription = '';

      localStorage.setItem('showHeadApproveCard', cardType === 'headApprove');
      localStorage.setItem('showMyApproved', cardType === 'myApproved');
      localStorage.setItem('showMyRejected', cardType === 'myRejected');

      deptDescriptionsOptions = [...new Set(dataList.map(leave => leave.deptDescription ? leave.deptDescription : leave.deptDescSecond))];
    },  

    handleFilterLeaves() {
      this.filterDialog = true;
    },

    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    async fetchpendingLeaves() {
      try {
        await helperMethods.delay(1500);
        await this.$store.dispatch('leaveModule/fetchpendingLeaves');
        this.pendingLeaveDetails = this.pendingDetails
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

        const localStorageShowHeadApproveCard = localStorage.getItem('showHeadApproveCard');
        const localStorageShowMyApproved = localStorage.getItem('showMyApproved');
        const localStorageShowMyRejected = localStorage.getItem('showMyRejected');

        if (localStorageShowHeadApproveCard !== null && 
            localStorageShowMyApproved !== null &&
            localStorageShowMyRejected !== null) {
          this.showHeadApproveCard = localStorageShowHeadApproveCard === 'true';
          this.showMyApproved = localStorageShowMyApproved === 'true';
          this.showMyRejected = localStorageShowMyRejected === 'true';
        } else {
            this.showHeadApproveCard = true;
        }

        const pendingLeave = this.pendingLeaveDetails;
        deptDescriptionsOptions = [...new Set(pendingLeave.map(leave => leave.deptDescription ? leave.deptDescription : leave.deptDescSecond))];
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get pending leaves / Admin Only', error);
      } 
    },


    async fetchapprovedLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchapprovedLeaves');
        this.approvedLeaves = this.appDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get Approved leaves / Admin Only', error);
      }
    },

    async fetchrejectedLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchrejectedLeaves');
        this.rejectedLeaves = this.rejectDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get Rejected leaves / Admin Only', error);
      }
    },



    async fetchUserApprovedLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchUserApprovedLeave');
        this.userApprovedLeave = this.userAppLeave
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get User Approved Leaves')
      }
    },

    async fetchUserRejectedLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchUserRejectedLeave');
        this.userRejectedLeave = this.userRejectLeave
        this.loadingCounter++;
        if (this.loadingCounter === 6) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get User Approved Leaves')
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


    // async approveLeave(leaveId) {
    //   try {
    //     let leaveIds;
    //     let isMultiple = false;

    //     if (Array.isArray(leaveId)) {
    //       leaveIds = leaveId.map(item => item.leaveId);
    //       isMultiple = leaveIds.length > 1;
    //     } else {
    //       leaveIds = [leaveId];
    //     }
    //     this.$q.loading.show({
    //       spinner: QSpinnerIos,
    //       message: 'Approving Leave Request',
    //       messageColor: 'primary',
    //       backgroundColor: 'grey-1',
    //       spinnerColor: 'primary',
    //       customClass: 'custom-loading-style',
    //       spinnerSize: '7em',
    //     });

    //     await helperMethods.delay(1500);
    //     await this.$store.dispatch('leaveModule/approveLeaves', leaveIds);
    //     this.fetchpendingLeaves();
    //     this.fetchapprovedLeaves();
    //     this.selectedItems = [];
    //     this.$q.loading.hide();
    //     helperMethods.disablePointerEvents(2000);
    //     this.$q.notify({
    //       color: 'positive',
    //       position: 'center',
    //       message: `Success Approving Leave Request${isMultiple ? 's' : ''}`,
    //       icon: 'check',
    //       iconColor: 'white',
    //       timeout: 1000,
    //       progress: true,
    //     });
    //     this.selectAllLevel1 = false;
    //     this.selectAllLevel2 = false;
    //   } catch (error) {
    //     if(error.response.status === 405) {
    //       this.$q.loading.hide();
    //       console.error('Error Approving Leave Request');
    //       this.$q.notify({
    //         color: 'negative',        
    //         position: 'center',
    //         message: 'You Are Not Allowed/Authorized To Approve This Leave',
    //         icon: 'report_problem',  
    //         iconColor: 'white',
    //         timeout: 1000,
    //         progress: true,
    //       });
    //       return;
    //     }
    //     this.$q.loading.hide();
    //     console.error('Error Approving Leave Request');
    //     this.$q.notify({
    //       color: 'negative',        
    //       position: 'center',
    //       message: 'Failed Approving Leave',
    //       icon: 'report_problem',  
    //       iconColor: 'white',
    //       timeout: 1000,
    //       progress: true,
    //     });
    //   }
    // },

    // async rejectLeave() {
    //   try {

    //     let leaveIds;
    //     let isMultiple = false;
    //     const reason = this.reasonForRejection;

    //     if(reason.length === 0) {
    //       this.$q.notify({
    //         color: 'negative',
    //         position: 'center',
    //         message: 'Input the Required Field (Reason)',
    //         icon: 'report_problem',
    //         iconColor: 'white',
    //         timeout: 1000,
    //         progress: true,
    //       });
    //       return;
    //     }

    //     if (Array.isArray(this.rejectId)) {
    //       leaveIds = this.rejectId.map(item => item.leaveId);
    //       isMultiple = leaveIds.length > 1;
    //     } else {
    //       leaveIds = [this.rejectId];
    //     }
    //       const rejectData = {
    //         LeaveID: leaveIds,
    //         reason: reason,
    //         Status: 'Rejected'
    //       };

    //       this.$q.loading.show({
    //         spinner: QSpinnerIos,
    //         message: 'Rejecting Leave Request',
    //         messageColor: 'primary',
    //         backgroundColor: 'grey-1',
    //         spinnerColor: 'primary',
    //         customClass: 'custom-loading-style',
    //         spinnerSize: '7em',
    //       });

    //     this.rejectDialog = false;
    //     await helperMethods.delay(1500);
    //     await this.$store.dispatch('leaveModule/rejectLeaves', rejectData);
    //     this.selectedItems = [];
    //     this.fetchpendingLeaves();
    //     this.fetchrejectedLeaves();
    //     this.$q.loading.hide();
    //     helperMethods.disablePointerEvents(2000);
    //     localStorage.setItem(cardToShow, true.toString());
    //     this.reasonForRejection = '';
    //     this.$q.notify({
    //       color: 'positive',
    //       position: 'center',
    //       message: `Success Rejecting Leave Request${isMultiple ? 's' : ''}`,
    //       icon: 'check',
    //       iconColor: 'white',
    //       timeout: 1000,
    //       progress: true,
    //     });
    //     this.selectAllLevel1 = false;
    //     this.selectAllLevel2 = false;
    //   } catch (error) {
    //     if(error.response.status === 405) {
    //       this.$q.loading.hide();
    //       this.reasonForRejection = '';
    //       console.error('Error Approving Leave Request');
    //       this.$q.notify({
    //         color: 'negative',        
    //         position: 'center',
    //         message: 'You Are Not Allowed/Authorized To Reject This Leave',
    //         icon: 'report_problem',  
    //         iconColor: 'white',
    //         timeout: 1000,
    //         progress: true,
    //       });
    //       return;
    //     }
    //     this.$q.loading.hide();
    //     this.reasonForRejection = '';
    //     console.error('Error Rejecting Leave Request');
    //     this.$q.notify({
    //       color: 'negative',
    //       position: 'center',
    //       message: 'Failed Rejecting Leave Request',
    //       icon: 'report_problem',
    //       iconColor: 'white',
    //       timeout: 1000,
    //       progress: true,
    //     });
    //   }
    // },

  },

  created() {
    this.fetchpendingLeaves();
    this.fetchapprovedLeaves();
    this.fetchrejectedLeaves();
    this.fetchUserApprovedLeaves();
    this.fetchUserRejectedLeaves();
    this.fetchLeaveTypes()

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('showHeadApproveCard', this.showHeadApproveCard.toString());
      // localStorage.setItem('showSupervisorCard', this.showSupervisorCard.toString());
      localStorage.setItem('showMyApproved', this.showMyApproved.toString());
      localStorage.setItem('showMyRejected', this.showMyRejected.toString());
    });
  },



};

</script>


<style>

.rounded {
  border-radius: 10px;
  margin-top: 10px;
  padding-bottom: 10px;
}

.roundedd1 {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 50px;
  padding-bottom: 10px;
}


.containermainn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}


</style>