<template>
  <div :class="[!range ? 'w-[150px]' : '']">
    <!-- Input Readonly -->
    <q-input
      color="primary"
      dense
      v-model="displayDate"
      readonly
      outlined
      :class="inputWidth"
      class="!text-twBlack bg-white rounded-lg"
      @click="openDialog = true"
    >
      <template v-slot:prepend v-if="showPeriode">
        <div class="text-softPurple text-sm flex">
          Periode <q-separator vertical class="!ml-2 !mr-1" />
        </div>
      </template>
      <template v-slot:append>
        <q-icon
          name="event"
          size="xs"
          class="cursor-pointer text-twSecondary"
          @click="openDialog = true"
          style="font-size: 14px"
        >
        </q-icon>
      </template>
    </q-input>

    <!-- Dialog -->
    <q-dialog v-model="openDialog">
      <q-card class="!bg-mainCard">
        <q-card-section class="flex justify-between">
          <div class="text-weight-medium" style="font-size: medium">
            {{ title }}
          </div>
          <q-btn flat round icon="close" size="sm" v-close-popup />
        </q-card-section>

        <q-separator color="greyQuasar" />

        <q-card-section style="max-height: 100vh" class="row scroll justify-center">
          <q-date
            :range="range"
            :landscape="$q.screen.gt.xs"
            v-model="internalDate"
            :mask="mask"
            @update:model-value="handleDateChange"
          ></q-date>
        </q-card-section>

        <q-separator color="greyQuasar" />

        <q-card-actions align="around">
          <q-btn flat label="Batal" no-caps color="primary" @click="cancel" />
          <q-btn label="Simpan" no-caps color="primary" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('id')
export default {
  name: 'Dialogdate',
  props: {
    title: {
      type: String,
      default: 'Pilih Periode',
    },
    range: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    showPeriode: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [String, Object],
      default: () => {
        const startOfMonth = moment().startOf('month').format('YYYY-MM-DD')
        const endOfMonth = moment().endOf('month').format('YYYY-MM-DD')
        return { from: startOfMonth, to: endOfMonth }
      },
    },
    inputWidth: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      openDialog: false,
      //   internalDate: "",
    }
  },
  computed: {
    internalDate: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
    displayDate() {
      const format = 'YYYY/MM/DD'
      if (typeof this.internalDate === 'string') {
        return moment(this.internalDate).format(format)
      } else if (this.internalDate?.from && this.internalDate?.to) {
        return `${moment(this.internalDate.from).format(format)} - ${moment(
          this.internalDate.to,
        ).format(format)}`
      }
      return ''
    },
  },
  methods: {
    handleDateChange(newDate) {
      //   console.log(newDate, "newDate");
      //   this.internalDate = newDate;
    },
    save() {
      //   this.$emit("update:modelValue", this.internalDate);
      this.$emit('change', this.internalDate)
      this.openDialog = false
    },
    cancel() {
      this.openDialog = false
    },
  },
}
</script>

<style lang="scss">
.q-field {
  &.q-field--readonly {
    &.q-field--outlined {
      .q-field__control {
        &:before {
          border: 1px solid var(--color-twBorder);
        }
      }
    }
  }
}
</style>
<style scoped>
/* :deep(.q-field__native) {
  color: var(--color-twBlack) !important;
} */
</style>
