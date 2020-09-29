const fs = require('fs').promises;

// Read file content asynchronously
const readData = async () => {
    try {
        const content = await fs.readFile("caso1.txt", "utf-8");
        const fields = content.split('\r\n');       // The last element is empty 
        fields.pop();                               // Removes the last element because it's empty
        fields.shift();                             // Removes the first because it's only the length
        const data = fields
            .filter((el, index) => index % 2 != 0)  // Only odd indexes
            .map(el => el.trim())                   // Removes whitespaces
            .map(el => el.split(" "))               // split lines into array of values
            .map(el => el.map(x => Number(x)));     // turn everything to numbers

        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const saveResult = async (dataArr) => {
    const data = dataArr.join("\r\n");
    await fs.writeFile("resultado.txt", data);
}

// |        0 * |
// |  0 * * 0 0 |
// |  0 0 * 0 0 |
// |0 0 0 * 0 0 |
// --------------
// Left shadowed array
const leftShadow = arr => {
    const shadow = [];
    shadow.push(arr[0]);
    arr.forEach((level, index) => {
        if (index == 0) return;
        
        shadow.push(
            level > shadow[shadow.length - 1]
            ? level
            : shadow[shadow.length - 1]
        );
    });

    return shadow;
}

// |* * * * 0   |
// |* 0 * * 0 0 |
// |* 0 0 * 0 0 |
// |0 0 0 * 0 0 |
// --------------
// Right shadowed array
const rightShadow = arr => {
    const revArr = [...arr].reverse();
    const shadow = leftShadow(revArr).reverse();

    return shadow;
}

const min = (a, b) => a < b ? a: b;

// Intersection of left and right shadows
const intersecShadows = (leftArr, rightArr) => {
    const intersec = [];
    leftArr.forEach((_, index) => {
        intersec.push(min(leftArr[index], rightArr[index]));
    })

    return intersec;
}

// Sum of array elements
const sum = arr => arr.reduce((acc, curr) => acc + curr, 0);

// Difference between shadowed and concrete areas
const computeFlood = arr => {
    const shadowed = intersecShadows(leftShadow(arr), rightShadow(arr));

    const shadowArea = sum(shadowed) - sum(arr);
    return shadowArea;
}

const main = async () => {
    const silhouettes = await readData();

    const result = silhouettes.map(sil => computeFlood(sil));
    await saveResult(result);
}

main();