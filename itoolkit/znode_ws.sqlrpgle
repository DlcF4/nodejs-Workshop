       ctl-opt datfmt(*eur) datedit(*dmy) debug(*yes) copyright('Faq400 srl')
        decedit('0,');
       //------------------------------------------------------------------------*
       // Definizione parametri di ingresso                                      *
       //------------------------------------------------------------------------*
       dcl-pr znode_ws extpgm('ZNODE_WS');
         *n              char(10);
         *n              char(10);
         *n              char(20);
       end-pr;
       //------------------------------------------------------------------------*
       dcl-pi znode_ws;
          a1                              char(10);
          a2                              char(10);
          r                               char(20);
       end-pi;
       //------------------------------------------------------------------------*
       // Main program                                                           *
       //------------------------------------------------------------------------*
       // Concatena variabili in ingresso
       r=%trim(a1)+' '+%trim(a2);


       *inlr = *on;
       return;
