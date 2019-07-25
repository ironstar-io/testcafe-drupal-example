const createTestCafe = require("testcafe");

const runTests = async () => {
  try {
    const testcafe = await createTestCafe("localhost", 1337, 1338);
    const runner = testcafe.createRunner();

    // const remoteConnection = await testcafe.createBrowserConnection();

    // console.log(
    //   `Running tests can be viewed by visiting ${remoteConnection.url}`
    // );

    const failedCount = await runner
      .src(["tests/fixtures"])
      .browsers(["chrome:headless"])
      .screenshots(
        "tests/reports/screenshots/",
        true,
        "${DATE}_${TIME}/test-${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.png"
      )
      .video(
        "tests/reports/videos/",
        {
          singleFile: true,
          failedOnly: true,
          pathPattern: "${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.mp4"
        },
        {
          r: 20,
          aspect: "4:3"
        }
      )
      .reporter([
        "spec",
        {
          name: "xunit",
          output: "tests/reports/report.xml"
        }
      ])
      .run();

    if (failedCount > 0) {
      throw new Error(`${failedCount} tests failed!`);
    }

    console.log("All tests passing!");
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  } finally {
    testcafe.close();
  }
};

runTests();
