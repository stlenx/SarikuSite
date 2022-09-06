class Variation {
    constructor(type, url) {
        this.type = type;
        this.url = url;
    }
}

class SearchResult {
    constructor(meaning, synonyms, variations, video) {
        this.meaning = meaning;
        this.synonyms = synonyms;
        this.variations = variations;
        this.video = video;
    }
}

class Search {
    constructor(meaning, results) {
        this.meaning = meaning;
        this.results = results;
    }
}

class SignFactory {
    create(json) {
        let variations = [];
        for(let pos = 0; pos < json.pageResults.variations.length; pos++) {
            let i = json.pageResults.variations[pos];

            variations.push(new Variation(i.type, i.url));
        }

        return new SearchResult(
            json.pageResults.pageDetails.meaning,
            json.pageResults.pageDetails.synonyms,
            variations,
            json.pageResults.videoURL.split(":")[2]
        );

        ////Extra info! -Twiple-
        //LoadExtraInfo(output.pageResults.pageDetails);
    }
}
