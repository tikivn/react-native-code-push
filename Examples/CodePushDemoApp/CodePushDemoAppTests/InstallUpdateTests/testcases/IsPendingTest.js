"use strict";

import React from "react-native";
import { DeviceEventEmitter, Platform, AppRegistry } from "react-native";
import CodePush from "react-native-code-push";
let NativeCodePush = React.NativeModules.CodePush;
import createTestCaseComponent from "../../utils/createTestCaseComponent";
let PackageMixins = require("react-native-code-push/package-mixins.js")(NativeCodePush);
import assert from "assert";

let remotePackage = require("../resources/remotePackage");

let IsPendingTest = createTestCaseComponent(
  "IsPendingTest",
  "After the app is installed, the isPending property on the installed package should be set to \"true\"",
  () => {
    if (Platform.OS === "android") {
      remotePackage.downloadUrl = "http://10.0.3.2:8081/CodePushDemoAppTests/InstallUpdateTests/resources/CheckIsFirstRunAndPassTest.includeRequire.runModule.bundle?platform=android&dev=true"
    } else if (Platform.OS === "ios") {
      remotePackage.downloadUrl = "http://localhost:8081/CodePushDemoAppTests/InstallUpdateTests/resources/CheckIsFirstRunAndPassTest.includeRequire.runModule.bundle?platform=ios&dev=true"
    }
    
    remotePackage = Object.assign(remotePackage, PackageMixins.remote);
  },
  async () => {
    let localPackage = await remotePackage.download();
    await localPackage.install(NativeCodePush.codePushInstallModeOnNextRestart);
    assert(localPackage.isPending, "isPending should be set to \"true\" after an install");
    localPackage = await CodePush.getCurrentPackage();
    assert(localPackage.isPending, "isPending should be set to \"true\" after an install");
  }
);

AppRegistry.registerComponent("IsPendingTest", () => IsPendingTest);