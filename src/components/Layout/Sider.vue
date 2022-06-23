<template>
    <div class="sider">
        <!-- sider主菜單 -->
        <div
            class="sider-menu"
            v-for="(item, index) in menusArray"
            :key="index"
            @click="onChangeMenu(index)"
        >
            <template v-if="item.path != '/more'">
                <a @click="routerLink(item)"
                    ><!--  :to="item.path"_-->
                    <div
                        :class="
                            currentIndex == index
                                ? 'sider-item sider-item__acitve flex'
                                : 'sider-item flex'
                        "
                    >

                        <!-- //圖標 -->
                        <LineIcon v-if="item.type == 'wechat'"/>
                        <a-icon  v-else :type="item.type" :title="item.title" />


                        <!-- badge徽章 通知數量標記 -->
                        <span
                            v-if="item.path == '/mail'"
                            class="sider-item__tipIcon"
                        >
                            <a-icon
                                v-if="!isMailSyncing"
                                type="warning"
                                theme="filled"
                                class="icon--yellow"
                            />
                            <span
                                v-else-if="newMailCount > 0"
                                class="sider-item__badge flex-center"
                            >
                                {{ newMailCount }}
                            </span>
                        </span>
                        <span v-else-if="item.path == '/sns'" class="sider-item__tipIcon">
                            <a-icon
                                v-if="!isLineSyncing"
                                type="warning"
                                theme="filled"
                                class="icon--yellow"
                            />
                        </span>
                        <!-- <span
                            v-if="item.path == '/deals'"
                            class="sider-item__tipIcon"
                        >
                            交易2.0
                        </span> -->
                        <!-- <span v-if="item.path == '/persons'" class="sider-item__tipIcon">
                                    客戶2.0
                                </span> -->
                    </div>
                </a>
            </template>
            <template v-else>
                <div
                    :class="{
                        'sider-item__acitve flex':
                            currentIndex == index && !isSubMenusShow,
                        'sider-item flex': true,
                        'sider-item__focus': isSubMenusShow,
                    }"
                    @click="openSubMenu"
                >
                    <a-icon :type="item.type" :title="item.title" />
                </div>
            </template>
        </div>

        <!-- 二級彈出層菜單 -->
        <a-drawer
            placement="left"
            :closable="false"
            :visible="isSubMenusShow"
            @close="isSubMenusShow = false"
            getContainer=".ant-layout-content"
            :wrap-style="{ position: 'absolute' }"
            :zIndex="900"
            :width="200"
            :maskStyle="{ backgroundColor: '#00000000' }"
            :drawerStyle="{ padding: 0, borderRadius: 0 }"
            :bodyStyle="{ padding: 0, borderRadius: 0 }"
        >
            <div class="sider-submenu flex-column">
                <div
                    class="sider-submenu__item"
                    v-for="(item, index) in subMenu"
                    :key="index"
                    @click="routerLink(item)"
                >
                    <div class="flex">
                        <a-icon :type="item.type" :title="item.title" />
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </a-drawer>

        <div class="navSubMenu" v-show="false">
            <!-- // todo: 遍歷submenus
                <ul class="padding-20">
                    <li @click="pgLink('/userProfile')">
                        <a>
                        <a-icon type="dropbox" class="iconNav" title="使用者概要">使用者概要</a>
                    </li>
                    <li @click="pgLink('/importData')">
                        <a>
                        <a-icon type="vertical-align-bottom" class="iconNav" title="導入資料" />導入資料</a>
                    </li>
                    <li @click="pgLink('/ImportExcel')">
                        <a>
                        <a-icon type="vertical-align-bottom" class="iconNav" title="導入資料Excel" />導入資料Excel</a>
                    </li>
                    <li @click="pgLink('/importData')">
                        <a>
                        <a-icon type="vertical-align-top" class="iconNav" title="導出資料"/>導出資料</a>
                    </li>
                    <li @click="pgLink('/importData')">
                        <a>
                        <a-icon type="vertical-align-middle" class="iconNav" title="合併重複"/>合併重複</a>
                    </li>
                    <li @click="pgLink('/importData')">
                        <a>
                        <a-icon type="book" class="iconNav" title="知識庫"/>知識庫</a>
                    </li>
                    <li @click="pgLink('/importData')">
                        <a>
                        <a-icon type="phone" class="iconNav" title="行動裝置"/>行動裝置</a>
                    </li>
                    <li @click="pgLink('/insightsChartList')">
                        <a>
                        <a-icon type="bar-chart" class="iconNav" title="圖表分析"/>圖表分析
                        </a>
                    </li>
                </ul> -->
        </div>
    </div>
</template>

<script>
const LineSvg = {
  template: `
    <svg t="1646914054257" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8088" width="50" height="50"><path d="M826.24 420.821333a26.922667 26.922667 0 0 1 0 53.802667H751.36v48h74.88a26.88 26.88 0 1 1 0 53.717333h-101.802667a26.922667 26.922667 0 0 1-26.752-26.837333V345.941333c0-14.72 12.032-26.88 26.88-26.88h101.802667a26.88 26.88 0 0 1-0.128 53.76H751.36v48h74.88z m-164.48 128.682667a26.88 26.88 0 0 1-26.922667 26.752 26.368 26.368 0 0 1-21.76-10.666667l-104.234666-141.525333v125.44a26.88 26.88 0 0 1-53.632 0V345.941333a26.752 26.752 0 0 1 26.624-26.794666c8.32 0 16 4.437333 21.12 10.837333l105.045333 142.08V345.941333c0-14.72 12.032-26.88 26.88-26.88 14.72 0 26.88 12.16 26.88 26.88v203.562667z m-244.949333 0a26.965333 26.965333 0 0 1-26.922667 26.837333 26.922667 26.922667 0 0 1-26.752-26.837333V345.941333c0-14.72 12.032-26.88 26.88-26.88 14.762667 0 26.794667 12.16 26.794667 26.88v203.562667z m-105.216 26.837333H209.792a27.050667 27.050667 0 0 1-26.88-26.837333V345.941333c0-14.72 12.16-26.88 26.88-26.88 14.848 0 26.88 12.16 26.88 26.88v176.682667h74.922667a26.88 26.88 0 0 1 0 53.717333M1024 440.064C1024 210.901333 794.24 24.405333 512 24.405333S0 210.901333 0 440.064c0 205.269333 182.186667 377.258667 428.16 409.941333 16.682667 3.498667 39.381333 11.008 45.141333 25.173334 5.12 12.842667 3.370667 32.682667 1.621334 46.08l-6.997334 43.52c-1.92 12.842667-10.24 50.602667 44.757334 27.52 55.082667-22.997333 295.082667-173.994667 402.602666-297.6C988.842667 614.101333 1024 531.541333 1024 440.064" p-id="8089"></path></svg>
  `,
}

const LineIcon = {
  template: `
    <a-icon :component="LineSvg" />
  `,
  data() {
    return {
      LineSvg,
    };
  },
}

export default {
    name: "Sider",
    components: {
        LineIcon
    },
    data() {
        return {
            // menusArray: ['github','google','apple','amazon','ellipsis'],
            currentIndex: 0,
            isSubMenusShow: false,
            menusArray: [
                // {
                //     path: '/custLatent',
                //     title: '潛在客戶',
                //     type: 'usergroup-add'
                // },
                // {
                //     path: '/business',
                //     title: '交易',
                //     type: 'dollar',
                // },

                {
                    path: '/deals',
                    title: '交易',
                    type: 'dollar',
                },
                // {
                //     path: "/mail",
                //     title: "郵件",
                //     type: "mail",
                // },
                {
                    path: "/activities",
                    title: "活動",
                    type: "schedule",
                },
                {
                    path: "/persons",
                    title: "客戶",
                    type: "user",
                },
                {
                    path: "/company",
                    title: "組織",
                    type: "shop",
                },
                // {
                //     path: "/sns",
                //     title: "訊息",
                //     type: "wechat",
                // },
                // {
                //     path: "/lineMarketing",
                //     title: "郵件營銷",
                //     type: "inbox",
                // },
                // {
                //     path: "/insights",
                //     title: "洞察分析",
                //     type: "area-chart"
                // },
                // {
                //     path: "/more",
                //     title: "更多..導入資料",
                //     type: "small-dash",
                // },
            ],
            subMenu: [
                {
                    path: "/import",
                    title: "導入資料",
                    type: "vertical-align-bottom",
                },
            ],
        };
    },
    computed: {
        currentPath() {
            let path = this.$route.path;
            return path;
        },
        isMailSyncing() {
            //計算當前賬戶是否有郵件為同步狀態
            let result = this.$store.state.mail.isMailSyncing;
            return result;
        },
        isLineSyncing() {
			return this.$store.state.sns.isLineSyncing
		},
        newMailCount() {
            return this.$store.state.mail.newMailCount;
        },
    },
    watch: {
        currentPath: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                let path = this.$route.path;
                if (~path.indexOf("setting") || ~path.indexOf("import")) {
                    this.currentIndex = this.menusArray.length - 1;
                } else if (~path.indexOf("process")) {
                    // 銷售流程的功能表，處理為選中銷售交易模組
                    this.currentIndex = this.menusArray.findIndex(
                        (item) => ~item.path.indexOf("deals")
                    );
                } else {
                    this.currentIndex = this.menusArray.findIndex(
                        (item) => ~path.indexOf(item.path)
                    );
                }
            },
        },
    },
    methods: {
        onChangeMenu(index) {
            if (index == this.menusArray.length - 1) return;
            this.currentIndex = index;
        },
        openSubMenu() {
            this.isSubMenusShow = !this.isSubMenusShow;
        },
        routerLink(linkData) {
            // console.log("linkData==============", linkData);

            if (~this.$route.path.indexOf("/mail/"))
                this.$store.commit("mail/SET_MAIL_PATH", this.$route.path); // 如果是當前在郵件詳情頁面，存儲當前頁面的路徑

            this.isSubMenusShow = false;

            if (linkData.path == "/mail") {
                let mailPath = this.$store.state.mail.mailPath;
                // console.log("mailPath=========", mailPath);
                if (mailPath == "") this.$router.push(linkData.path);
                if (mailPath != "")
                    this.$router.push(mailPath),
                        this.$store.commit("mail/SET_MAIL_PATH", "");
            } else {
                this.$router.push(linkData.path);
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.sider {
    padding-top: 5px;
    align-items: center;
    z-index: 3;
    position: relative;
    z-index: 999 !important;
    flex: 1;
    height: 100%;
    justify-content: flex-start;
    .ant-layout-content {
        position: relative;
    }
    .ant-drawer .ant-drawer-content-wrapper,
    .ant-drawer-content {
        border-top-left-radius: 0 !important;
    }
    &-menu {
        // 主菜單
        z-index: 901 !important;
        position: relative;
    }
    &-submenu {
        // 二級彈出菜單
        padding: 10px 0px;
        &__item {
            cursor: pointer;
            // height: 35px;
            padding: 10px 24px;
            min-height: 20px;
            font-size: 16px;
            &:hover {
                background: #f6f6fc;
                color: #f86f54;
            }
            .anticon {
                font-size: 18px;
                margin-right: 5px;
            }
        }
    }
}

.sider .anticon {
    font-size: 26px !important;
}

.sider-menu,
.sider-item {
    color: #d2d2d2;
    position: relative;
    width: 80px;
    height: 60px;
    margin: auto;
    width: 70px;
    height: 55px;
    justify-content: center;
    border-radius: 7px;
    margin-bottom: 3px;
    cursor: pointer;
}

.sider-item__tipIcon {
    position: absolute;
    top: 5px;
    right: 10px;
}

.sider-item__tipIcon .anticon {
    font-size: 18px !important;
}

.sider-item__badge {
    color: #ffffff;
    background: #f74536;
    height: 18px;
    width: 20px;
    border-radius: 50%;
}

.sider-item:hover {
    background: #f6f6fc;
    color: #383839 !important;
}

.sider-item__acitve {
    background: #f6f6fc;
    color: #383839 !important;
    position: relative;
}

.sider-item__focus {
    background: #f6f6fc;
    color: #383839 !important;
    position: relative;
}

.sider-item__acitve::before,
.sider-item:hover::before {
    content: "";
    height: 56px;
    width: 4px;
    position: absolute;
    left: -10px;
    top: 3px;
    border-radius: 5px;
    left: -2px;
    top: 0px;
    height: 55px;
    width: 3px;
    background: #f86f54;
}
</style>
