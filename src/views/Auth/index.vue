<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-08 22:14:48
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-25 13:11:57
-->
<template>
    <div class="AuthUI flex">
        <div class="AuthUI-img">
            <img src="@/assets/crmImages/login.png" class="img" />
        </div>

        <div class="AuthUI-panel flex-center">
            <transition
                v-if="currentAuthPath == '/login'"
                name="fade-transform"
                mode="out-in"
            >
                <LoginCard />
            </transition>

            <transition
                v-else-if="currentAuthPath == '/login/forget-password'"
                name="fade-transform"
                mode="out-in"
            >
                <ForgetPassword />
            </transition>

            <transition
                v-else-if="currentAuthPath == '/register'"
                name="fade-transform"
                mode="out-in"
            >
                <Register />
            </transition>
        </div>
    </div>
</template>

<script>
import LoginCard from "./Login";
import ForgetPassword from "./ForgetPassword";
import Register from "./Register";
export default {
    name: "Auth",
    components: {
        LoginCard,
        ForgetPassword,
        Register,
    },
    data() {
        return {};
    },
    created() {
        console.log("Auth Created");
        sessionStorage.clear();
    },
    computed: {
        currentAuthPath() {
            console.log(this.$route.path, "Auth");
            return this.$route.path;
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less">
.AuthUI {
    width: 100vw;
    height: 100vh;
    min-width: 960px;
    padding: 0;
    margin: 0;
    background: #fff;
    font-size: 15px !important;
    &-img {
        width: 55%;
        height: 100%;
        padding: 0;
        margin: 0;
        min-width: 550px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &-panel {
        height: 100%;
        flex: 1;
        min-width: 550px;
    }
    &-card {
        width: 450px;
        &__title {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        &__tips {
            margin-bottom: 30px;
        }
        &__tabs {
            width: 80%;
            margin-left: 10%;
            &--line {
                width: 100%;
                margin-bottom: 7px !important;
            }
            &--tips {
                margin-top: -7px !important;
            }
        }
    }
    &-btn--big {
        button {
            width: 360px;
            height: 40px;
            border-radius: 20px !important;
        }
        margin-top: 15px;
    }
    &-btn--link {
        color: #317ae2;
        margin-top: 80px;
        width: 120px;
        margin-left: 50%;
        transform: translateX(-50%);
        font-size: 15px;
    }
}
</style>
