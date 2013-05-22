(function($) {

  // model
  window.Album = Backbone.Model.extend({
    isFirstTrack: function(index) {
      return index == 0;
    },
    isLastTrack: function(index) {
      return index >= this.get('tracks').length - 1;
    },
    trackUrlAtIndex: function(index) {
      if (this.get('tracks').length >= index) {
        return this.get('tracks')[index].url;
      }
      return null;
    }
  }); //model

// collection of albums
  window.Albums = Backbone.Collection.extend({
    model: Album,
    url: '/albums'

  });


  // collection of albums that will be played by the user
  window.Playlist = Albums.extend({
    isFirstAlbum: function(index) {
      return index == 0;
    },
    isLastAlbum: function(index) {
      return (index == (this.models.length -1));
    }
  });

  window.library = new Albums();
  // This will be the model for the player!
  window.Player = Backbone.Model.extend({
    defaults: {
      'currentAlbumIndex': 0,
      'currentTrackIndex': 0,
      'state': 'stop'
    },

    initialize: function() {
      this.playlist = new Playlist();
    },

    play: function() {
      this.set({'state': 'play'});
    },

    pause: function() {
      this.set({'state': 'pause'});
    },

    isPlaying: function() {
      return (this.get('state') == 'play');
    },

    isStopped: function() {
      return (!this.isPlaying());
    },

    currentAlbum: function() {
      return this.playlist.at(this.get('currentAlbumIndex'));
    },

    currentTrackUrl: function() {
      var album = this.currentAlbum();
      return album.trackUrlAtIndex(this.get('currentTrackIndex'));
    },

    // quite complicated methods - will check for 2 possibilites
    // if it's the last song, jumps to first song in next album
    // if it's last song and last album, jumps to first song in first album
    nextTrack: function() {
      var currentTrackIndex = this.get('currentTrackIndex'),  // just to unpollute code
      currentAlbumIndex = this.get('currentAlbumIndex');
        if (this.currentAlbum().isLastTrack(currentTrackIndex)) {
          if (this.playlist.isLastAlbum(currentAlbumIndex)) {
            this.set({
              'currentAlbumIndex': 0 // returns to first album
            });
            this.set({
            'currentTrackIndex': 0 // plays first song
            });
          } else {
              this.set({
                'currentAlbumIndex': currentAlbumIndex + 1 //jumps to next album
              });
              this.set({
                'currentTrackIndex': 0 //plays first song of that album
              });
            }
          } else {
            this.set({
              'currentTrackIndex': currentTrackIndex + 1 // if it's not last song, simply plays next song
            });
          }
          this.logCurrentAlbumAndTrack();
    },
      // if it's first song, jumps to previous album
      // if it's first song of first album, jumps to last album
      prevTrack: function() {
          var currentTrackIndex = this.get('currentTrackIndex'),
          currentAlbumIndex = this.get('currentAlbumIndex'),
          lastModelIndex = 0;
          if (this.currentAlbum().isFirstTrack(currentTrackIndex)) {
              if (this.playlist.isFirstAlbum(currentAlbumIndex)) {
                  lastModelIndex = this.playlist.models.length - 1; // will receive index of last album
                  this.set({
                      'currentAlbumIndex': lastModelIndex // sets current album to last album
                  });
              } else {
                  this.set({
                      'currentAlbumIndex': currentAlbumIndex - 1 // jumps to previous album
                  });
              }
              // In either case, go to last track on album
              var lastTrackIndex =
              this.currentAlbum().get('tracks').length - 1;
              this.set({
                  'currentTrackIndex': lastTrackIndex
              });
          } else {
              this.set({
                  'currentTrackIndex': currentTrackIndex - 1 // simply plays previous song
              });
          }
          this.logCurrentAlbumAndTrack();
      },

      // display which album and track is being played
      logCurrentAlbumAndTrack: function() {
          console.log("Player " +
          this.get('currentAlbumIndex') + ':' +
          this.get('currentTrackIndex'), this);
      }
  });


  window.player = new Player();





})(jQuery);
