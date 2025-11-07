<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.user_id" placeholder="用户ID" style="width: 200px; margin-right: 4px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-button class="filter-item" type="primary" :icon="iconSearch" @click="handleFilter">
        <span v-waves>搜索</span>
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="订单ID" align="center" width="200" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.display_recharge_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="200" >
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ formatIdDisplay(row.user_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册邮箱" width="150px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }} USDT</span>
        </template>
      </el-table-column>
      <el-table-column label="币价（汇率）" width="110px" align="center">
        <template v-slot="{row}">
          <span>{{ row.exchange_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等值人民币" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.cny_amount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="充值截图" width="130px" align="center">
        <template v-slot="{row}">
          <!-- <span>{{ formatImageUrl(row.recharge_images) }}</span> -->
          <img 
            :src="row?.recharge_images ? formatImageUrl(row.recharge_images) : ''"
            alt="payment" 
            class="tw-w-12 tw-h-16 tw-mx-auto cursor-pointer"
            @click="openPreview(formatImageUrl(row?.recharge_images))"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusFilterMap[row.status]">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" style="flex: 1; min-width: 300px">
        <template v-slot="{row, $index}">
          <el-button :disabled="row.status !== 0" size="small" type="success" @click="handleModifyStatus(row, 1)">
            通过
          </el-button>
          <el-button :disabled="row.status !== 0" size="small" type="danger" @click="handleModifyStatus(row, -1)">
            驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.page_size" @pagination="handlePageChange" />

    <el-dialog
      v-model="isPreviewOpen"
      align-center
	    style="width: 380px; height: 540px; background-color: transparent; box-shadow: none;"
    >
      <img
        :src="currentImageUrl"
        alt="Preview"
        class="tw-w-full tw-max-h-[540px] tw-object-contain"
        @click.stop
      />
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="400">
      <el-form :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="订单ID">
          <span>{{ temp.display_recharge_id }}</span>
        </el-form-item>
        <el-form-item label="ID">
          <span>{{ formatIdDisplay(temp.user_id) }}</span>
        </el-form-item>
        <el-form-item label="注册邮箱">
          <span>{{ temp.user_name }}</span>
        </el-form-item>
        <el-form-item label="充值金额">
          <span>{{ temp.amount }} USDT</span>
        </el-form-item>
        <el-form-item label="币价（汇率）">
          <span>{{ temp.exchange_rate }}</span>
        </el-form-item>
        <el-form-item label="等值人民币">
          <span>{{ temp.cny_amount }} 元</span>
        </el-form-item>
        <el-form-item label="充值截图">
          <template v-slot="{row}">
            <!-- <span>{{ formatImageUrl(row.recharge_images) }}</span> -->
            <img 
              :src="temp?.recharge_images ? formatImageUrl(temp.recharge_images) : ''"
              alt="payment" 
              class="tw-w-12 tw-h-16 cursor-pointer"
              @click="openPreview(formatImageUrl(temp?.recharge_images))"
            />
          </template>
        </el-form-item>
        <el-form-item label="状态">
          <template v-slot="{row}">
            <el-tag :type="statusFilterMap[temp.status]">
              {{ statusMap[temp.status] }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="申请时间">
          <template v-slot="{row}">
            <span>{{ parseTime(temp.created_at, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="tw-flex tw-justify-start tw-ml-40">
          <el-button type="primary" @click="dialogFormVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';
import { Search, Edit } from '@element-plus/icons-vue';
import * as RechargeApi from '@/api/recharge';
import store from '@/store';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { ElMessage } from 'element-plus';
import { formatIdDisplay, formatImageUrl } from '@/utils/tool'

const statusMap = {
  '0': '待审核',
  '1': '已通过',
  '-1': '已驳回',
}
const statusFilterMap = {
  '0': 'warning',
  '1': 'success',
  '-1': 'danger',
};

export default defineComponent({
  name: 'RechargePage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      iconSearch: markRaw(Search),
      iconEdit: markRaw(Edit),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20,
        user_id: '',
      },
      isRequesting: false,
      statusMap,
      statusFilterMap,
      isPreviewOpen: false,
      currentImageUrl: false,
      temp: {},
      dialogStatus: '',
      textMap: {
        detail: '详情',
      },
      dialogFormVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    formatIdDisplay,
    formatImageUrl,
    async getList() {
      this.listLoading = true;
      const adminLoginToken = store.admin().adminLoginToken
      try {
        const listResp = await RechargeApi.fetchRechargeList(adminLoginToken, this.listQuery)
        if (listResp.data.code === 10000) {
          this.list = listResp.data.data.recharges;
          this.total = listResp.data.data.total;
        } else {
          ElMessage.error(listResp.data.msg)
        } 
      } catch (error) {
        console.log(error)
      } finally {
        this.listLoading = false
      }
    },
    async handlePageChange() {
      if (this.isRequesting) return; // 如果正在请求，则不重复请求

      this.isRequesting = true; // 开始请求
      await this.getList();
      this.isRequesting = false; // 请求完成
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    async handleModifyStatus(row, status) {
      const adminLoginToken = store.admin().adminLoginToken
      const updateResp = await RechargeApi.updateRecharge(adminLoginToken, {
        id: row.id,
        status,
      })
      if (updateResp.data.code === 10000) {
        row.status = status;
        const index = this.list.findIndex(v => v.id === row.id);
        this.list.splice(index, 1, row);
        ElNotification({
          title: 'Success',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      }
    },
    openPreview(imageUrl) {
      this.currentImageUrl = imageUrl;
      this.isPreviewOpen = true;
    },
    handleShowDetail(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'detail';
      this.dialogFormVisible = true;
    },
  }
});
</script>
