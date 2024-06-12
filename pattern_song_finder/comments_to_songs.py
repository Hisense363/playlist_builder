import sys, os, json, re, requests, argparse
import pandas as pd, numpy as np

parser = argparse.ArgumentParser(description = 'parse arguments for songs file creater')
parser.add_argument('--file', dest = 'file', type = str)
parser.add_argument('--format', dest = 'format', type = str)
parser.add_argument('--likes', dest = 'likes', type = str)
parser.add_argument('--dest_file', dest = 'dest_file', type = str)
args = parser.parse_args()

def data_to_comments(data):
    '''
    shittiest function in history
    extract all comments and likes from json file
    '''
    comments = []
    scores = []
    for c in data[1]['data']['children']:
        comments.append(c['data']['body'])
        scores.append(c['data']['score'])
        if c['data']['replies'] != '':
            for r in c['data']['replies']['data']['children'] :
                comments.append(r['data']['body'])
                scores.append(r['data']['score'])
                if r['data']['replies'] != '':
                    for s in r['data']['replies']['data']['children'] :
                        comments.append(s['data']['body'])
                        scores.append(s['data']['score'])
                        if s['data']['replies'] != '':
                            for t in s['data']['replies']['data']['children'] :
                                comments.append(t['data']['body'])
                                scores.append(t['data']['score'])
                                if t['data']['replies'] != '':
                                    for u in t['data']['replies']['data']['children'] :
                                        comments.append(u['data']['body'])
                                        scores.append(u['data']['score'])
                                        if u['data']['replies'] != '':
                                            for v in u['data']['replies']['data']['children'] :
                                                comments.append(v['data']['body'])
                                                scores.append(v['data']['score'])
                                                if v['data']['replies'] != '':
                                                    for w in v['data']['replies']['data']['children'] :
                                                        comments.append(w['data']['body'])
                                                        scores.append(w['data']['score'])
                                                        if w['data']['replies'] != '':
                                                            for x in w['data']['replies']['data']['children'] :
                                                                comments.append(x['data']['body'])
                                                                scores.append(x['data']['score'])
    return pd.DataFrame( {'comments': comments, 'likes': scores})


def find_song_by_band(text, score=0):
    '''
    finds pattern "song - band" in text of each comment. passes on score (likes) of comment.
    note: tunemymusic still finds song if song/band are in opposite order
    '''
    pattern = r'\b[\w\s]+ by [\w\s]+\b'
    matches = re.findall(pattern, text)
    song, band, likes = [], [], []
    for m in matches:
        song.append(m.split(' by ')[0])
        band.append(m.split(' by ')[1])
        likes.append(score)
    return pd.DataFrame( {'song':song, 'band':band, 'likes':likes}) #


def find_song_dash_band(text, score=0):
    '''
    finds pattern "song by band" in text of each comment. passes on score (likes) of comment
    '''
    pattern = r'\b[\w\s]+ - [\w\s]+\b'
    matches = re.findall(pattern, text)
    song, band, likes = [], [], []
    for m in matches:
        song.append(m.split(' - ')[0])
        band.append(m.split(' - ')[1])
        # song.append(m.split(' - ')[1])  #in case it's backwards
        # band.append(m.split(' - ')[0])  #^
        likes.append(score)
    return pd.DataFrame( {'song':song, 'band':band, 'likes':likes})  #



def comments_to_songs(file, format, likes, dest_file):
    '''
    file: path or url to comments file. text or json
    format: 'json' or 'txt'
    json if in the original form in the form of 'sample.json' on the github. 
    (json_url = 'https://raw.githubusercontent.com/Hisense363/playlist_builder/main/sample.json')
    txt if in text file with column of songs, column of bands, optional column of likes
    likes: True/False - whether or not to include 'likes' column in the text file. i didn't want that in there 
    when testing the file in Tunemymusic, but we might want it later.
    dest_file: path to write text file to
    '''
    #load data
    if format == 'json':
        json_url = file
        response = requests.get(json_url)
        if response.status_code == 200:
            data = json.loads(response.text)
        else:
            print(f"Error retrieving file: {response.status_code}")
        comment_df = data_to_comments(data)
    else:
        print("i don't know what the text file will look like so i didn't do this yet")

#create and fill song/band/likes data table
    song_band_df = pd.DataFrame({'song':[], 'band':[], 'likes':[]}) 
    for index, row in comment_df.iterrows():
        song_band_df = pd.concat([song_band_df, 
                                find_song_dash_band(row.comments, row.likes), 
                                find_song_by_band(row.comments, row.likes)], 
                               ignore_index = True)

#write to txt file
    path = dest_file
    #print(likes)
    with open(path, 'a', encoding="utf-8") as f:  #, encoding="utf-8"
        if likes == 'True':
            song_df_string = song_band_df[['song', 'band', 'likes']].to_string(header=False, index=False)
        else:
            song_df_string = song_band_df[['song', 'band']].to_string(header=False, index=False)
        f.write(song_df_string)  





if __name__ == "__main__":
    comments_to_songs(args.file, args.format, args.likes, args.dest_file)



'''
to use script in terminal:

python comments_to_songs.py --file 'https://raw.githubusercontent.com/Hisense363/playlist_builder/main/sample.json' --format 'json' --likes 'False' --dest_file 'song_test.txt'

'''











