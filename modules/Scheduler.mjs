import fs from "fs";
import {argvOptions} from "./argvOptions";

const maxStreamsCount = 100;
let activeStreamsCount = 0;
let total = 0;
let done = 0;
const queue = new Map();
const startTime = Date.now();
const searchReg = argvOptions.outputFilter ? new RegExp(argvOptions.outputFilter, 'ig') : null;

const drawStatus = () => {
    console.clear();

    const timeSpent = Date.now() - startTime;
    const minutes = Math.floor(timeSpent / 1000 / 60);
    const seconds = Math.floor((timeSpent - (minutes * 60 * 1000)) / 1000);

    console.log('threads:', activeStreamsCount);
    console.log('queue:', queue.size);
    console.log('total:', done, '/', total);
    console.log('time:', minutes.toString().padStart(2, '0'), ':', seconds.toString().padStart(2, '0'));
};

const tryRunStream = () => {
    if (activeStreamsCount >= maxStreamsCount) {
        return;
    }
    const availableCount = maxStreamsCount - activeStreamsCount;
    const streamsToRun = [...queue.keys()]
        .filter(key => searchReg ? searchReg.test(key) : true)
        .slice(0, availableCount);

    streamsToRun.forEach(filePath => {
        // console.log('start:', filePath);
        drawStatus();

        const streamCallback = queue.get(filePath);
        let writeStream;
        activeStreamsCount++;

        try {
            writeStream = streamCallback();

            writeStream
                .pipe(fs.createWriteStream(filePath))
                .on('close', () => {
                    // console.log('finish:', filePath);
                    done++;
                    drawStatus();
                    
                    activeStreamsCount--;
                    setTimeout(() => {
                        tryRunStream();
                    })
                });
        } catch (e) {
            console.error(`writing stream for ${filePath} failed with`, e);

            activeStreamsCount--;
            setTimeout(() => {
                tryRunStream();
            })
        }

        queue.delete(filePath);
    });
}

export const scheduleStream = (filePath, streamCallback) => {
    total++;

    // console.log('add:', filePath);
    drawStatus();
    queue.set(filePath, streamCallback);

    tryRunStream();
}