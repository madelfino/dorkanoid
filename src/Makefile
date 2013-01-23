export DEBUGBUILD = no
ifeq ($(DEBUGBUILD), yes)
    DEBUGFLAGS = -g -DDEBUG
else
    DEBUGFLAGS = -O2 -DNDEBUG
endif

export CC       = g++
export CFLAGS   = -W -Wall -ansi -I../../include $(DEBUGFLAGS)
export LDFLAGS  = 
export EXECPATH = ../bin

EXEC = dorkanoid
OBJ = Dorkanoid.o
EXECPATH = ../bin

dorkanoid: $(OBJ)
	$(CC) $(LDFLAGS) -o $(EXECPATH)/$@ $(OBJ) -lsfml-audio -lsfml-graphics -lsfml-window -lsfml-system

%.o: %.cpp
	$(CC) -o $@ -c $< $(CFLAGS)

clean:
	rm -rf *.o
